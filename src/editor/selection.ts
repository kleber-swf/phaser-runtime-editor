const BORDER_COLOR = 0xFFFFFF;
const BORDER_STROKE = 0x3498DB;

const PIVOT_COLOR = 0xFFFFFF;
const PIVOT_STROKE = 0x2ECC71;

const ANCHOR_COLOR = 0xFFFFFF;
const ANCHOR_STROKE = 0xD9B448;

export class Selection extends Phaser.Graphics {
	private readonly scaleKnobs: ScaleKnob[];

	private _obj: PIXI.DisplayObject = null;
	public get hasObject() { return !!this._obj; }

	constructor(game: Phaser.Game) {
		super(game);
		this.name = '__selection';
		this.__skip = true;
		this.scaler = new Scaler();
		this.scaleKnobs = this.createScaleKnobs();
		this.setSelection(null);
	}

	private createScaleKnobs() {
		const knobs: ScaleKnob[] = [
			new ScaleKnob(this.game, 1, 1, 0, 0),	// top left
			new ScaleKnob(this.game, 0, 1, 1, 0),	// top right
			new ScaleKnob(this.game, 0, 0, 1, 1),	// bottom right
			new ScaleKnob(this.game, 1, 0, 0, 1),	// bottom left
		];

		knobs.forEach(k => {
			k.events.onInputDown.add(() => this.startScaling(k), this);
			k.events.onInputUp.add(this.stopScaling, this);
			this.addChild(k);
		});

		return knobs;
	}

	public setSelection(obj: PIXI.DisplayObject) {
		this._obj = obj;
		this.clear();
		if (this.visible = !!obj) this.redraw();
	}

	private redraw() {
		this.clear();
		if (!this._obj) return;
		const bounds = this._obj.getBounds();
		this.drawBorder(bounds);
		this.drawPivot(this._scaling ? this.scaler.originalPivot : this._obj.pivot);
		this.drawAnchor(this._obj.anchor, bounds);
		this.drawScaleKnobs(bounds);
		this.position.set(bounds.x, bounds.y);
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
			.lineStyle(2, ANCHOR_COLOR, 1)
			.drawCircle(bounds.width * anchor.x, bounds.height * anchor.y, 10);
	}

	private drawScaleKnobs(bounds: PIXI.Rectangle) {
		this.scaleKnobs[0].position.set(0, 0);
		this.scaleKnobs[1].position.set(bounds.width, 0);
		this.scaleKnobs[2].position.set(bounds.width, bounds.height);
		this.scaleKnobs[3].position.set(0, bounds.height);
	}

	public move(deltaX: number, deltaY: number) {
		let pos: PIXI.Point = this.position;
		this.position.set(pos.x + deltaX, pos.y + deltaY);
		pos = this._obj.position;
		this._obj.position.set(pos.x + deltaX, pos.y + deltaY);
	}


	private _scaling = false;
	private scaler: Scaler;

	private startScaling(knob: ScaleKnob) {
		this.scaler.startScaling(this._obj, knob);
		this._scaling = true;
	}

	public stopScaling() {
		this._scaling = false;
		this.scaler.stopScaling();
		this.redraw();
	}

	public update() {
		super.update();
		if (this._scaling) {
			const pointer = this.game.input.mousePointer;
			this.scaler.scaleToPoint(pointer.x, pointer.y);
			this.redraw();
		}
	}
}

export class ScaleKnob extends Phaser.Graphics {
	constructor(game: Phaser.Game,
		public readonly xwf: number,
		public readonly yhf: number,
		public readonly pxf: number,
		public readonly pyf: number,
	) {
		super(game);
		this.lineStyle(2, BORDER_STROKE, 1)
			.beginFill(BORDER_COLOR, 1)
			.drawCircle(0, 0, 16);
		this.inputEnabled = true;
	}
}

// TODO inverted scale
export class Scaler {
	public readonly unscaledBounds = new Phaser.Rectangle();
	public readonly originalPivot = new PIXI.Point();
	public readonly transformPivot = new PIXI.Point();

	private obj: PIXI.DisplayObject;

	private _left: boolean;
	private _top: boolean;

	public startScaling(obj: PIXI.DisplayObject, knob: ScaleKnob) {
		this.obj = obj;
		this._left = knob.xwf === 0;
		this._top = knob.yhf === 0;

		const bounds = obj.getBounds();

		this.unscaledBounds.setTo(
			bounds.x + bounds.width * knob.xwf,
			bounds.y + bounds.height * knob.yhf,
			bounds.width / obj.scale.x,
			bounds.height / obj.scale.y,
		);

		this.originalPivot.set(obj.pivot.x, obj.pivot.y);

		this.transformPivot.set(
			knob.xwf * (bounds.width / obj.scale.x),
			knob.yhf * (bounds.height / obj.scale.y),
		);

		const pos = obj.position.clone();

		obj.pivot.set(this.transformPivot.x, this.transformPivot.y);

		obj.position.set(
			pos.x + (this.transformPivot.x - this.originalPivot.x) * obj.scale.x,
			pos.y + (this.transformPivot.y - this.originalPivot.y) * obj.scale.y,
		);
	}

	public stopScaling() {
		const obj = this.obj;
		obj.pivot.set(this.originalPivot.x, this.originalPivot.y);
		obj.position.set(
			obj.x - (this.transformPivot.x - this.originalPivot.x) * obj.scale.x,
			obj.y - (this.transformPivot.y - this.originalPivot.y) * obj.scale.y,
		);
	}

	public scaleToPoint(x: number, y: number) {
		const ub = this.unscaledBounds;
		const distX = this._left ? x - ub.x : ub.x - x;
		const distY = this._top ? y - ub.y : ub.y - y;
		this.obj.scale.set(distX / ub.width, distY / ub.height,);
	}
}