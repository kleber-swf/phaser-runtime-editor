import { ScaleGizmo } from './scale.gizmo';
import { Scaler } from './scaler';

export class ScaleHandler extends Phaser.Group {
	private readonly gizmos: ScaleGizmo[];
	private _scaling = false;

	public readonly scaler: Scaler;
	public selectedObject: PIXI.DisplayObject;

	public get scaling() { return this._scaling; }

	constructor(game: Phaser.Game) {
		super(game);
		this.__skip = true;
		this.scaler = new Scaler();
		this.gizmos = this.createGizmos(game);

		this._tmpTransformPivotGizmo = new Phaser.Graphics(game);
		this.addChild(this._tmpTransformPivotGizmo);
	}

	private createGizmos(game: Phaser.Game) {
		const gizmos: ScaleGizmo[] = [
			new ScaleGizmo(game, 1, 1),		// top left
			new ScaleGizmo(game, 0, 1),		// top right
			new ScaleGizmo(game, 0, 0),		// bottom right
			new ScaleGizmo(game, 1, 0),		// bottom left

			new ScaleGizmo(game, 0.5, 1),	// top
			new ScaleGizmo(game, 1, 0.5),	// right
			new ScaleGizmo(game, 0.5, 0),	// bottom
			new ScaleGizmo(game, 0, 0.5),	// left
		];

		gizmos.forEach(gizmo => {
			gizmo.events.onInputDown.add(() => this.startScaling(gizmo), this);
			gizmo.events.onInputUp.add(this.stopScaling, this);
			this.addChild(gizmo);
		});

		return gizmos;
	}

	public redraw(bounds: PIXI.Rectangle) {
		const knobs = this.gizmos;
		knobs[0].position.set(0, 0);											// top left
		knobs[1].position.set(bounds.width, 0);							// top right
		knobs[2].position.set(bounds.width, bounds.height);			// bottom right
		knobs[3].position.set(0, bounds.height);							// bottom right

		knobs[4].position.set(bounds.width * 0.5, 0);					// top
		knobs[5].position.set(0, bounds.height * 0.5);					// right
		knobs[6].position.set(bounds.width * 0.5, bounds.height);	// bottom
		knobs[7].position.set(bounds.width, bounds.height * 0.5);	// left

		this._tmpDrawTransformPivot(this.scaler.transformPivot);
	}

	private startScaling(knob: ScaleGizmo) {
		this.scaler.startScaling(this.selectedObject, knob.factorH, knob.factorV);
		this._scaling = true;
	}

	private stopScaling() {
		this._scaling = false;
		this.scaler.stopScaling();
	}

	public handle() {
		if (!this._scaling) return false;
		const pointer = this.game.input.mousePointer;
		this.scaler.scaleToPoint(pointer.x, pointer.y);
		return true;
	}

	private _tmpTransformPivotGizmo: Phaser.Graphics;

	private _tmpDrawTransformPivot(pivot: PIXI.Point) {
		this._tmpTransformPivotGizmo.clear()
			.lineStyle(2, 0xFFFFFF, 1)
			.beginFill(0xFF8888, 1)
			.drawCircle(pivot.x, pivot.y, 30)
			.endFill();
	}
}
