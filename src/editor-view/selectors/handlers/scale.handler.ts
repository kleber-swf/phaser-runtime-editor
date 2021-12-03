import { Point } from 'plugin.model';
import { HSide, ScaleGizmo, VSide } from '../gizmos/scale-gizmo';
import { SelectionUtil } from '../selection.util';
import { DraggingHandler } from './dragging-handler';

export class ScaleHandler implements DraggingHandler {
	private _point: Point;
	private _object: PIXI.DisplayObject;
	private _vside: VSide;
	private _hside: HSide;

	private _isGroup: boolean;
	private _top: number;
	private _left: number;

	public startHandling(e: MouseEvent, object: PIXI.DisplayObject): void {
		const gizmo = e.target as ScaleGizmo;
		let hside = gizmo.hside;
		let vside = gizmo.vside;

		if (hside === undefined || vside === undefined) {
			this._object = null;
			return;
		}

		this._object = object;

		// inverting axis
		if (object.scale.x < 0) {
			if (hside === HSide.Left) hside = HSide.Right;
			else if (hside === HSide.Right) hside = HSide.Left;
		}

		if (object.scale.y < 0) {
			if (vside === VSide.Top) vside = VSide.Bottom;
			else if (vside === VSide.Bottom) vside = VSide.Top;
		}

		this._vside = vside;
		this._hside = hside;

		object.updateTransform();

		let pivotx = 0;
		let pivoty = 0;
		let x = 0;
		let y = 0;

		if (hside === HSide.Right) {
			pivotx = 0;
			x = object.x - object.pivot.x * object.scale.x;
		} else if (hside === HSide.Left) {
			pivotx = Math.abs(object.width / object.scale.x);
			x = object.x - object.pivot.x * object.scale.x + object.width;
		} else {
			pivotx = Math.abs(object.width / object.scale.x) * 0.5;
			x = object.x - object.pivot.x * object.scale.x + object.width * 0.5;
		}

		if (vside === VSide.Bottom) {
			pivoty = 0;
			y = object.y - object.pivot.y * object.scale.y;
		} else if (vside === VSide.Top) {
			pivoty = Math.abs(object.height / object.scale.y);
			y = object.y - object.pivot.y * object.scale.y + object.height;
		} else {
			pivoty = Math.abs(object.height / object.scale.y) * 0.5;
			y = object.y - object.pivot.y * object.scale.y + object.height * 0.5;
		}

		object.pivot.set(pivotx, pivoty);
		object.position.set(x, y);

		// this._isGroup = !object.anchor;
		// if (this._isGroup) {
		// 	this._top = object.top;
		// 	this._left = object.left;
		// }

		object.updateTransform();
	}

	public handle(e: MouseEvent): void {
		if (!this._object) return;
		if (!this._point) {
			this._point = SelectionUtil.mouseEventToGamePoint(e, { x: 0, y: 0 });
		}

		const lastPoint = this._point;
		const newPoint = SelectionUtil.mouseEventToGamePoint(e, { x: 0, y: 0 });

		let dx = 0;
		if (this._hside === HSide.Left) dx = lastPoint.x - newPoint.x;
		else if (this._hside === HSide.Right) dx = newPoint.x - lastPoint.x;

		let dy = 0;
		if (this._vside === VSide.Top) dy = lastPoint.y - newPoint.y;
		else if (this._vside === VSide.Bottom) dy = newPoint.y - lastPoint.y;
		// if (this._corner == Corner.BottomRight) dx = newPoint.x - lastPoint.x;
		// else if (this._corner === Corner.BottomLeft) dx = lastPoint.x - newPoint.x;
		// const dx = newPoint.x - lastPoint.x; // bottom right
		// const dx = lastPoint.x - newPoint.x; // bottom left
		// const dy = newPoint.y - lastPoint.y;
		this._point = newPoint;

		this._object.updateTransform();
		this._object.width += dx;
		this._object.height += dy;

		if (this._isGroup) {
			this._object.top = this._top;
			this._object.left = this._left;
		}
		this._object.updateTransform();
	}

	public stopHandling(): void {
		this._point = null;
		// if (!this._object) return;
		// TODO reset object
	}
}
