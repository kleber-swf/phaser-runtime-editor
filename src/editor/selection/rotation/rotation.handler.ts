import { RotationGizmo } from './rotation.gizmo';

export class RotationHandler extends Phaser.Group {
	private gizmos: RotationGizmo[];

	constructor(game: Phaser.Game) {
		super(game);
		this.gizmos = this.createGizmos(game);
	}

	private createGizmos(game: Phaser.Game) {
		const gizmos: RotationGizmo[] = [
			new RotationGizmo(game),		// top left
			new RotationGizmo(game),		// top right
			new RotationGizmo(game),		// bottom right
			new RotationGizmo(game),		// bottom left
		];

		gizmos.forEach(gizmo => {
			// gizmo.events.onInputDown.add(() => this.startScaling(gizmo), this);
			// gizmo.events.onInputUp.add(this.stopScaling, this);
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
	}
}