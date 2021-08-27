const BORDER_COLOR = 0xFFFFFF;
const BORDER_STROKE = 0x3498DB;

const PIVOT_COLOR = 0xFFFFFF;
const PIVOT_STROKE = 0x2ECC71;

const ANCHOR_COLOR = 0xFFFFFF;
const ANCHOR_STROKE = 0xD9B448;

export class Selection extends Phaser.Graphics {
	private _obj: PIXI.DisplayObject;
	public get selectedObject() { return this._obj; }

	constructor(game: Phaser.Game) {
		super(game);
		this.name = '__selection';
		this.__skip = true;
	}

	public setSelection(obj: PIXI.DisplayObject) {
		this._obj = obj;
		this.clear();
		if (!obj) return;

		const bounds = obj.getBounds();

		this.drawBorder(bounds);
		this.drawPivot(obj.pivot);
		this.drawAnchor(obj.anchor, bounds);

		this.position.set(bounds.x, bounds.y);
	}

	public move(deltaX: number, deltaY: number) {
		let pos: PIXI.Point = this.position;
		this.position.set(pos.x + deltaX, pos.y + deltaY);
		pos = this._obj.position;
		this._obj.position.set(pos.x + deltaX, pos.y + deltaY);
	}

	private drawBorder(bounds: PIXI.Rectangle) {
		this
			.lineStyle(4, BORDER_STROKE, 1)
			.drawRect(0, 0, bounds.width, bounds.height)
			.lineStyle(2, BORDER_COLOR, 1)
			.beginFill(0, 0)
			.drawRect(0, 0, bounds.width, bounds.height)
			.endFill();
	}

	private drawPivot(pivot: PIXI.Point) {
		this
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
		this
			.lineStyle(3, ANCHOR_STROKE, 1)
			.drawCircle(bounds.width * anchor.x, bounds.height * anchor.y, 10)
			.lineStyle(1, ANCHOR_COLOR, 1)
			.drawCircle(bounds.width * anchor.x, bounds.height * anchor.y, 10);
	}
}