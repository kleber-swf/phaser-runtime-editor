import { Data, DataOrigin } from 'data/data';
import { PointUtil } from 'util/math.util';
import { ANCHOR_COLOR, ANCHOR_STROKE, BORDER_COLOR, BORDER_STROKE, PIVOT_COLOR, PIVOT_STROKE } from '../scene-colors';
import { ScaleHandler } from './scale/scale.handler';

export class Selection extends Phaser.Group {
	private _selectedObject: PIXI.DisplayObject = null;
	public get hasObject() { return !!this._selectedObject; }

	private readonly view: Phaser.Graphics;
	private readonly scaleHandler: ScaleHandler;

	constructor(game: Phaser.Game) {
		super(game);
		this.name = '__selection';
		this.__skip = true;

		this.view = new Phaser.Graphics(game);
		this.addChild(this.view);

		this.scaleHandler = new ScaleHandler(game);
		this.addChild(this.scaleHandler);

		this.select(null);
	}

	public select(obj: PIXI.DisplayObject) {
		this._selectedObject = obj;
		this.view.clear();
		this.scaleHandler.selectedObject = obj;
		if (this.visible = !!obj) this.redraw();
	}

	public redraw() {
		this.view.clear();
		if (!this._selectedObject) return;
		const bounds = this._selectedObject.getBounds();
		this.drawBorder(bounds);
		this.drawPivot(this.scaleHandler.scaling
			? this.scaleHandler.scaler.originalPivot
			: this._selectedObject.pivot);
		this.drawAnchor(this._selectedObject.anchor, bounds);
		this.scaleHandler.redraw(bounds);
		this.position.set(bounds.x, bounds.y);
		this.rotation = this._selectedObject.rotation;
	}

	private drawBorder(bounds: PIXI.Rectangle) {
		this.view
			.lineStyle(4, BORDER_STROKE, 1)
			.drawRect(0, 0, bounds.width, bounds.height)
			.lineStyle(2, BORDER_COLOR, 1)
			.beginFill(0, 0)
			.drawRect(0, 0, bounds.width, bounds.height)
			.endFill();
	}

	private drawPivot(pivot: PIXI.Point) {
		this.view
			.lineStyle(3, PIVOT_STROKE, 1)
			.moveTo(pivot.x - 10, pivot.y)
			.lineTo(pivot.x + 10, pivot.y)
			.moveTo(pivot.x, pivot.y - 10)
			.lineTo(pivot.x, pivot.y + 10)

			.lineStyle(2, PIVOT_COLOR, 1)
			.moveTo(pivot.x - 9, pivot.y)
			.lineTo(pivot.x + 9, pivot.y)
			.moveTo(pivot.x, pivot.y - 9)
			.lineTo(pivot.x, pivot.y + 9);
	}

	private drawAnchor(anchor: PIXI.Point, bounds: PIXI.Rectangle) {
		if (!anchor) return;
		this.view
			.lineStyle(3, ANCHOR_STROKE, 1)
			.drawCircle(bounds.width * anchor.x, bounds.height * anchor.y, 10)
			.lineStyle(2, ANCHOR_COLOR, 1)
			.drawCircle(bounds.width * anchor.x, bounds.height * anchor.y, 10);
	}

	public move(deltaX: number, deltaY: number) {
		let pos: PIXI.Point = this.position;
		this.position.set(pos.x + deltaX, pos.y + deltaY);

		const scale = this._selectedObject.parent?.worldScale ?? PointUtil.one;
		pos = this._selectedObject.position;
		this._selectedObject.position.set(pos.x + deltaX / scale.x, pos.y + deltaY / scale.y);

		Data.propertyChanged('position', pos, DataOrigin.SCENE);
	}


	public update() {
		super.update();
		if (this.scaleHandler.handle()) this.redraw();
	}
}