import { Editor } from 'core/editor';
import { DataOrigin } from 'data/editor-data';
import { DragUtil } from '../util/drag.util';
import { SceneModel } from './scene-model';
import { Selection } from './selection/selection';

export class SceneView extends Phaser.Group {
	private readonly touchArea: Phaser.Graphics;
	private readonly selection: Selection;
	private readonly model: SceneModel;

	/** The container that will have the edition */
	private root: Container;

	/** Whether the mouse down has already selected an object */
	private _hasSelected: boolean;

	/** The last position the mouse was down (for dragging purposes) */
	private _lastPos = new Phaser.Point();

	/** Whether the user is dragging */
	private _isDragging = false;

	/** Whether the input down event happened here */
	private _isInputDown = false;

	constructor(game: Phaser.Game) {
		super(game, null);
		this.name = '__scene_editor';

		this.__skip = true;
		game.stage.__skip = true;
		game.world.__skip = true;

		this.model = new SceneModel();

		this.touchArea = this.createTouchArea(game);
		this.redrawTouchArea();

		this.selection = new Selection(game);
		this.addChild(this.selection);

		game.scale.onSizeChange.add(() => this.selectObject(Editor.data.selectedObject, false));

		Editor.data.onPropertyChanged.add(this.onPropertyChanged.bind(this));
		Editor.data.onSelectedObjectChanged.add(this.onObjectSelected.bind(this));
	}

	public enable(root: Container, parent: Phaser.Stage) {
		this.root = root;
		if (this.parent === parent) return;
		parent.addChild(this);
		this.touchArea.input.enabled = true;
	}

	public disable() {
		if (!this.parent) return;
		this.parent.removeChild(this);
		this.touchArea.input.enabled = false;
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

		const obj = Editor.data.selectedObject
		if (!obj) return;

		Editor.history.prepare(Editor.data.selectedObject, { position: obj.position.clone() });
	}

	private onInputUp(_: any, pointer: Phaser.Pointer) {
		this._isInputDown = false;
		const wasDragging = this._isDragging;
		this._isDragging = false;
		if (wasDragging) {
			Editor.history.commit();
			return;
		}
		Editor.history.cancel();
		if (this._hasSelected) return;
		this.trySelectOver(pointer);
		this._hasSelected = false;
	}

	private trySelectOver(pointer: Phaser.Pointer) {
		const objects: PIXI.DisplayObject[] = [];
		this.getObjectsUnderPoint(pointer.x, pointer.y, this.root.children, objects);

		const obj = this.model.setSelectionTree(objects);
		this.selectObject(obj, true);
		return obj !== null;
	}

	private selectObject(obj: PIXI.DisplayObject, dispatch: boolean) {
		this.selection.select(obj);
		if (dispatch) Editor.data.selectObject(obj, DataOrigin.SCENE);
	}

	private getObjectsUnderPoint(x: number, y: number, children: PIXI.DisplayObject[], objects: PIXI.DisplayObject[]) {
		for (let i = children.length - 1; i >= 0; i--) {
			const child = children[i];
			if (!child.visible || child.__skip || !('getBounds' in child)) continue;
			const bounds: PIXI.Rectangle = child.getBounds();
			if (!child.__isLeaf) this.getObjectsUnderPoint(x, y, child.children, objects);
			if (bounds.contains(x, y)) objects.push(child);
		}
	}

	public moveSelectedObject(deltaX: number, deltaY: number) {
		const obj = Editor.data.selectedObject;
		if (!obj) return;
		Editor.history.prepare(obj, { position: obj.position.clone() }).commit();
		obj.position.set(obj.position.x + deltaX, obj.position.y + deltaY);
		obj.updateTransform();
		this.selection.redraw();
		Editor.data.propertyChanged('position', obj.position.clone(), DataOrigin.SCENE);
		Editor.data.propertyChanged('_bounds', (obj as any)._bounds, DataOrigin.SCENE);
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