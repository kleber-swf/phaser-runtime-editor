import { Point } from 'plugin.model';
import { SelectionUtil } from '../selection.util';
import { DraggingHandler } from './dragging-handler';

export class RotationHandler implements DraggingHandler {
	private _object: PIXI.DisplayObject;
	private _objectPoint: Point;
	private _offset: number;
	private _initialRotation: number;

	public startHandling(_e: MouseEvent, object: PIXI.DisplayObject): void {
		this._object = object;
	}

	public handle(e: MouseEvent): void {
		const object = this._object;
		if (!this._objectPoint) {
			const wp = object.worldPosition;
			const p1 = this._objectPoint = {
				x: wp.x - object.pivot.x,
				y: wp.y - object.pivot.y,
			};
			const p2 = SelectionUtil.mouseEventToGamePoint(e, { x: 0, y: 0 });
			this._offset = Math.atan2(p2.x - p1.x, p2.y - p1.y);
			this._initialRotation = object.rotation;
		}

		const p1 = this._objectPoint;
		const p2 = SelectionUtil.mouseEventToGamePoint(e, { x: 0, y: 0 });
		const delta = this._offset - Math.atan2(p2.x - p1.x, p2.y - p1.y);
		console.log(delta);
		object.rotation = this._initialRotation + delta;
	}

	public stopHandling(): void {
		this._object = null;
		this._objectPoint = null;
	}
}
