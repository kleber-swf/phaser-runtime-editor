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
		const gizmos = this.gizmos;
		gizmos[0].position.set(0, 0);											// top left
		gizmos[1].position.set(bounds.width, 0);							// top right
		gizmos[2].position.set(bounds.width, bounds.height);			// bottom right
		gizmos[3].position.set(0, bounds.height);							// bottom right

		gizmos[4].position.set(bounds.width * 0.5, 0);					// top
		gizmos[5].position.set(0, bounds.height * 0.5);					// right
		gizmos[6].position.set(bounds.width * 0.5, bounds.height);	// bottom
		gizmos[7].position.set(bounds.width, bounds.height * 0.5);	// left
	}

	private startScaling(gizmos: ScaleGizmo) {
		this.scaler.startScaling(this.selectedObject, gizmos.factorH, gizmos.factorV);
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
}
