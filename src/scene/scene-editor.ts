import { Data, DataOrigin } from 'data/data';
import { History, HistoryEntry } from 'data/history';
import { DragUtil } from '../util/drag.util';
import { SceneMovel } from './scene-model';
import { Selection } from './selection/selection';

export class SceneEditor extends Phaser.Group {
	private readonly touchArea: Phaser.Graphics;
	private readonly container: Phaser.Group | Phaser.Stage;
	private readonly selection: Selection;
	private readonly model: SceneMovel;

	/** Whether the mouse down has already selected an object */
	private _hasSelected: boolean;

	/** The last position the mouse was down (for dragging purposes) */
	private _lastPos = new Phaser.Point();

	/** Whether the user is dragging */
	private _isDragging = false;

	/** Whether the input down event happened here */
	private _isInputDown = false;

	constructor(game: Phaser.Game, container: Phaser.Group | Phaser.Stage, parent: Phaser.Group | Phaser.Stage) {
		super(game, parent);
		this.name = '__scene_editor';

		this.__skip = true;
		game.stage.__skip = true;
		game.world.__skip = true;

		this.model = new SceneMovel();
		this.container = container;

		this.touchArea = this.createTouchArea(game);
		this.redrawTouchArea();

		this.selection = new Selection(game);
		this.addChild(this.selection);

		Data.onPropertyChanged.add(this.onPropertyChanged.bind(this));
		Data.onSelectedObjectChanged.add(this.onObjectSelected.bind(this));
		History.onHistoryWalk.add(this.onHistory, this);
	}

	private onPropertyChanged(origin: DataOrigin, property: string, value: any, obj: PIXI.DisplayObject) {
		if (origin === DataOrigin.SCENE || !(obj && property in obj)) return;
		obj[property] = value;
		obj.updateTransform();
		this.selection.redraw();
	}

	private onObjectSelected(origin: DataOrigin, obj: PIXI.DisplayObject) {
		if (origin !== DataOrigin.SCENE)
			this.selectObject(obj, false);
	}

	private onHistory(entry: HistoryEntry) {
		// this.selectObject(entry.obj, true);

	}

	private createTouchArea(game: Phaser.Game): Phaser.Graphics {
		const area = new Phaser.Graphics(game);
		area.inputEnabled = true;
		area.events.onInputDown.add(this.onInputDown, this);
		area.events.onInputUp.add(this.onInputUp, this);
		return this.add(area);
	}

	private redrawTouchArea() {
		this.touchArea.clear()
			.beginFill(0, 0)
			.drawRect(0, 0, this.game.width, this.game.height)
			.endFill();
	}

	private onInputDown(_: any, pointer: Phaser.Pointer) {
		this._isDragging = false;
		this._isInputDown = true;
		this._hasSelected = !this.selection.getBounds().contains(pointer.x, pointer.y)
			&& this.trySelectOver(pointer);
		this._lastPos.set(pointer.x, pointer.y);

		const obj = Data.selectedObject
		if (!obj) return;

		History.holdEntry({
			obj: Data.selectedObject,
			properties: { position: obj.position.clone() },
		});
	}

	private onInputUp(_: any, pointer: Phaser.Pointer) {
		this._isInputDown = false;
		const wasDragging = this._isDragging;
		this._isDragging = false;
		if (wasDragging) {
			History.commit();
			return;
		}
		History.cancel();
		if (this._hasSelected) return;
		this.trySelectOver(pointer);
		this._hasSelected = false;
	}

	private trySelectOver(pointer: Phaser.Pointer) {
		const objects: PIXI.DisplayObject[] = [];
		this.getObjectsUnderPoint(pointer.x, pointer.y, this.container.children, objects);

		const obj = this.model.setSelectionTree(objects);
		this.selectObject(obj, true);
		return obj !== null;
	}

	private selectObject(obj: PIXI.DisplayObject, dispatch: boolean) {
		this.selection.select(obj);
		if (dispatch) Data.selectObject(obj, DataOrigin.SCENE);
	}

	private getObjectsUnderPoint(x: number, y: number, children: PIXI.DisplayObject[], objects: PIXI.DisplayObject[]) {
		for (let i = children.length - 1; i >= 0; i--) {
			const child = children[i];
			if (!child.visible || child.__skip || !('getBounds' in child)) continue;
			const bounds: PIXI.Rectangle = child.getBounds();
			if ('children' in child) this.getObjectsUnderPoint(x, y, child.children, objects);
			if (bounds.contains(x, y)) objects.push(child);
		}
	}

	public update() {
		super.update();
		if (!this._isInputDown) return;
		const pointer = this.game.input.mousePointer;
		if (!(pointer.isDown && this.selection.hasObject)) return;
		if (!this._isDragging) {
			this._isDragging = DragUtil.shouldStartDrag(pointer);
			return;
		}
		this.selection.move(pointer.x - this._lastPos.x, pointer.y - this._lastPos.y);
		this._lastPos.set(pointer.x, pointer.y);
	}
}