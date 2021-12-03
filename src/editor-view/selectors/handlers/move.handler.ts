import { Point } from 'plugin.model';
import { SelectionUtil } from '../selection.util';
import { DraggingHandler } from './dragging-handler';

export class MoveHandler implements DraggingHandler {
	private _point: Point = { x: 0, y: 0 };
	private _object: PIXI.DisplayObject;

	public startHandling(e: MouseEvent, object: PIXI.DisplayObject) {
		this._object = object;
		SelectionUtil.mouseEventToGamePoint(e, this._point);
	}

	public handle(e: MouseEvent) {
		const lastPoint = this._point;
		const newPoint = SelectionUtil.mouseEventToGamePoint(e, { x: 0, y: 0 });

		const dx = newPoint.x - lastPoint.x
		const dy = newPoint.y - lastPoint.y
		this._point = newPoint;

		this._object.position.set(this._object.x + dx, this._object.y + dy);
	}

	public stopHandling() { this._object = null; }
}
