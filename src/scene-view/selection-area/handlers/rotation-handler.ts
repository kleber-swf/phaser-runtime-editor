import { Point } from 'plugin.model';
import { SelectionUtil } from '../selection.util';
import { DraggingHandler } from './dragging-handler';

export class RotationHandler implements DraggingHandler {
	private _object: PIXI.DisplayObject;
	private _objectPoint: Point;
	private _offset: number;
	private _initialRotation: number;

	private gg: Phaser.Graphics;

	public startHandling(_e: MouseEvent, object: PIXI.DisplayObject): void {
		this._object = object;

		const o = object as Phaser.Graphics;
		this.gg = new Phaser.Graphics(o.game, 0, 0);
		o.game.world.addChild(this.gg);
	}

	public handle(e: MouseEvent): void {
		const object = this._object;
		if (!this._objectPoint) {
			object.updateTransform();
			const wp = object.worldPosition;
			const p1 = this._objectPoint = {
				x: wp.x + object.pivot.x,
				y: wp.y + object.pivot.y,
			};

			this._initialRotation = object.rotation;
			// const p2 = SelectionUtil.mouseEventToGamePoint(e, { x: 0, y: 0 });
			const p2 = SelectionUtil.pointFromAreaToGame(e.offsetX, e.offsetY, { x: 0, y: 0 });
			this._offset = Math.atan2(p2.x - p1.x, p2.y - p1.y);
		}

		const p1 = this._objectPoint;
		// const p2 = SelectionUtil.mouseEventToGamePoint(e, { x: 0, y: 0 });
		const p2 = SelectionUtil.pointFromAreaToGame(e.offsetX, e.offsetY, { x: 0, y: 0 });
		const delta = this._offset - Math.atan2(p2.x - p1.x, p2.y - p1.y);

		this.gg.clear()
			.lineStyle(1, 0xFFFFFF)
			.moveTo(p1.x, p1.y)
			.lineTo(p2.x, p2.y);
		object.rotation = this._initialRotation + delta;
		object.updateTransform();
	}

	public stopHandling(): void {
		this._object = null;
		this._objectPoint = null;
	}
}
