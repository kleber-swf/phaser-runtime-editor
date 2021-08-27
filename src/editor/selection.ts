const BORDER_COLOR = 0xFFFFFF;
const BORDER_STROKE = 0x3498DB;

const PIVOT_COLOR = 0xFFFFFF;
const PIVOT_STROKE = 0x2ECC71;

const ANCHOR_COLOR = 0xFFFFFF;
const ANCHOR_STROKE = 0xD9B448;

export class Selection extends Phaser.Graphics {
	private readonly scaleKnobs: Phaser.Graphics[];

	private _obj: PIXI.DisplayObject = null;
	public get hasObject() { return !!this._obj; }

	constructor(game: Phaser.Game) {
		super(game);
		this.name = '__selection';
		this.__skip = true;
		this.scaleKnobs = this.createScaleKnobs();
	}

	private createScaleKnobs() {
		const knobs: Phaser.Graphics[] = [];
		for (let i = 0; i < 4; i++) {
			const knob = new Phaser.Graphics(this.game)
				.lineStyle(2, BORDER_STROKE, 1)
				.beginFill(BORDER_COLOR, 1)
				.drawCircle(0, 0, 16);
			knob.inputEnabled = true;
			knob.events.onInputDown.add(this.startScaling, this);
			knob.events.onInputUp.add(this.stopScaling, this);
			this.addChild(knob);
			knobs.push(knob);
		}
		return knobs;
	}

	public setSelection(obj: PIXI.DisplayObject) {
		this._obj = obj;
		this.clear();
		if (!obj) return;

		const bounds = obj.getBounds();
		this._objUnscaledBounds.setTo(
			bounds.x, bounds.y,
			bounds.width / obj.scale.x,
			bounds.height / obj.scale.y,
		);

		this.redraw();
	}

	private redraw() {
		this.clear();
		if (!this._obj) return;
		const bounds = this._obj.getBounds();
		this.drawBorder(bounds);
		this.drawPivot(this._obj.pivot);
		// this.drawAnchor(obj.anchor, bounds);
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
	private _objUnscaledBounds = new Phaser.Rectangle();

	private startScaling() { this._scaling = true; }
	private stopScaling() { this._scaling = false; }

	private doScale(pointer: Phaser.Pointer) {
		const distX = pointer.x - this._objUnscaledBounds.x;
		const distY = pointer.y - this._objUnscaledBounds.y;

		this._obj.scale.set(
			distX / this._objUnscaledBounds.width,
			distY / this._objUnscaledBounds.height,
		);

		this.redraw();
	}


	public update() {
		super.update();
		if (this._scaling) this.doScale(this.game.input.mousePointer);
	}
}