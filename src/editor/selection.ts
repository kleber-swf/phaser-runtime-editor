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
		this.drawPivot(this._obj.pivot);
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
		// TODO should't I use the scale too?
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
			this.scaler.scale(this.game.input.mousePointer);
			this.redraw();
		}
	}

	postUpdate() {
		if (this._obj) this._obj.updateTransform();
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


export class Scaler {
	private objUnscaledBounds = new Phaser.Rectangle();
	private obj: PIXI.DisplayObject;
	private objOriginalPivot = new PIXI.Point();
	private knob: ScaleKnob;

	private _left: boolean;
	private _top: boolean;

	public startScaling(obj: PIXI.DisplayObject, knob: ScaleKnob) {
		this.obj = obj;
		this.knob = knob;
		this._left = knob.xwf === 0;
		this._top = knob.yhf === 0;

		const bounds = obj.getBounds();

		this.objUnscaledBounds.setTo(
			bounds.x + bounds.width * knob.xwf,
			bounds.y + bounds.height * knob.yhf,
			bounds.width / obj.scale.x,
			bounds.height / obj.scale.y,
		);

		const originalPivot = this.obj.pivot.clone();
		const transformPivot = new Phaser.Point(
			knob.xwf * (bounds.width / obj.scale.x),
			knob.yhf * (bounds.height / obj.scale.y),
		);

		const pos = obj.position.clone();

		obj.pivot.set(transformPivot.x, transformPivot.y);

		obj.position.set(
			pos.x + (transformPivot.x - originalPivot.x) * obj.scale.x,
			pos.y + (transformPivot.y - originalPivot.y) * obj.scale.y,
		);

		this.objOriginalPivot = originalPivot;
	}

	public stopScaling() {
		const obj = this.obj;
		const bounds = obj.getBounds();
		const pos = obj.position;
		const knob = this.knob;
		const originalPivot = this.objOriginalPivot;
		const transformPivot = obj.pivot.clone();

		obj.pivot.set(originalPivot.x, originalPivot.y);
		obj.position.set(
			pos.x - (transformPivot.x - originalPivot.x) * obj.scale.x,
			pos.y - (transformPivot.y - originalPivot.y) * obj.scale.y,
		);
	}

	public scale(pointer: Phaser.Pointer) {
		const ub = this.objUnscaledBounds;
		const distX = this._left
			? pointer.x - ub.x
			: ub.x - pointer.x;

		const distY = this._top
			? pointer.y - ub.y
			: ub.y - pointer.y;

		this.obj.scale.set(
			distX / ub.width,
			distY / ub.height,
		);
	}
}