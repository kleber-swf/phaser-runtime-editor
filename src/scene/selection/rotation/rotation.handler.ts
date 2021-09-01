import { RotationGizmo } from './rotation.gizmo';

export class RotationHandler extends Phaser.Group {
	private gizmos: RotationGizmo[];
	public selectedObject: PIXI.DisplayObject;
	private _rotating = false;

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
			gizmo.events.onInputDown.add(() => this.startRotating(gizmo), this);
			gizmo.events.onInputUp.add(this.stopRotating, this);
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
	}

	private startRotating(gizmo: RotationGizmo) {
		this._rotating = true;
		const center = this.selectedObject.position;
		this._center.set(center.x, center.y);
		// this._initialRotation = this.selectedObject.rotation;
		this._initialRotation = this.calcAngleFor(gizmo.x, gizmo.y, 0);
	}


	private stopRotating() { this._rotating = false; }


	private _center = new Phaser.Point();
	private _initialRotation: number;

	public handle() {
		if (!this._rotating) return false;
		const pointer = this.game.input.mousePointer;
		this.selectedObject.rotation = this.calcAngleFor(pointer.x, pointer.y, this._initialRotation);
		return true;
	}

	private calcAngleFor(x: number, y: number, offset: number) {
		const rad = Phaser.Math.angleBetween(this._center.x, this._center.y, x, y);
		console.log(
			Phaser.Math.radToDeg(rad),
			Phaser.Math.radToDeg(offset),
			Phaser.Math.radToDeg(offset + rad),
		);
		return offset + rad;
	}
}