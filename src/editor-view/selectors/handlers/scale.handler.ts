import { Point } from 'plugin.model';
import { ScaleGizmo } from '../gizmos/scale-gizmo';
import { SelectionUtil } from '../selection.util';
import { DraggingHandler } from './dragging-handler';

export class ScaleHandler implements DraggingHandler {
	private _point: Point;
	private _object: PIXI.DisplayObject;
	private _isGroup: boolean;
	private _top: number;
	private _left: number;

	public startHandling(e: MouseEvent, object: PIXI.DisplayObject): void {
		const corner = (e.target as ScaleGizmo).corner;
		this._object = object;

		object.position.set(object.x - object.pivot.x, object.y - object.pivot.y);
		object.pivot.set(0, 0);

		this._isGroup = !object.anchor;
		if (this._isGroup) {
			this._top = object.top;
			this._left = object.left;
		}
	}

	public handle(e: MouseEvent): void {
		if (!this._point) {
			this._point = SelectionUtil.mouseEventToGamePoint(e, { x: 0, y: 0 });
		}

		const lastPoint = this._point;
		const newPoint = SelectionUtil.mouseEventToGamePoint(e, { x: 0, y: 0 });

		const dx = newPoint.x - lastPoint.x
		const dy = newPoint.y - lastPoint.y
		this._point = newPoint;

		this._object.updateTransform();
		this._object.width = this._object.width + dx;
		this._object.height = this._object.height + dy;

		if (this._isGroup) {
			this._object.top = this._top;
			this._object.left = this._left;
		}
		this._object.updateTransform();
	}

	public stopHandling(e: MouseEvent): void {
		this._point = null;
		if (!this._object) return;
		// TODO reset object
	}
}