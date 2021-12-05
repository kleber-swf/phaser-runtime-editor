import { Point } from 'plugin.model';
import { HSide, VSide } from '../gizmos/gizmo';
import { ScaleGizmo } from '../gizmos/scale-gizmo';
import { SelectionUtil } from '../selection.util';
import { DraggingHandler } from './dragging-handler';

// TODO
//	- reset pivot

export class ScaleHandler implements DraggingHandler {
	private _point: Point;
	private _object: PIXI.DisplayObject;
	private _vside: VSide;
	private _hside: HSide;
	private _centered = false;

	private _hsign = 0;
	private _vsign = 0;

	private _objectProps = {
		x: 0,
		y: 0,
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		pivotX: 0,
		pivotY: 0,
	};

	private _isGroup: boolean;
	private _groupStickySideH: string;
	private _groupStickySideV: string;

	public startHandling(e: MouseEvent, object: PIXI.DisplayObject): void {
		const gizmo = e.target as ScaleGizmo;
		let hside = gizmo.hside;
		let vside = gizmo.vside;

		if (hside === undefined || vside === undefined) {
			this._object = null;
			return;
		}

		this._object = object;
		this._centered = e.altKey;

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

		this._objectProps.pivotX = object.pivot.x;
		this._objectProps.pivotY = object.pivot.y;

		if (this._centered) {
			this.setPivotAndPosition(object, VSide.Middle, HSide.Center);
		} else {
			this.setPivotAndPosition(object, vside, hside);
		}

		object.updateTransform();

		console.log(vside, hside);
		this._vsign = Math.sign(vside - 0.5);
		this._hsign = Math.sign(hside - 0.5);
		this._objectProps.x = object.x + object.pivot.x * object.scale.x * this._hsign;
		this._objectProps.y = object.y + object.pivot.y * object.scale.y * this._vsign;

		this._isGroup = !object.renderable;
		if (!this._isGroup) return;

		this._objectProps.top = object.top;
		this._objectProps.left = object.left;
		this._objectProps.bottom = object.bottom;
		this._objectProps.right = object.right;

		if (vside === VSide.Top) this._groupStickySideV = 'bottom';
		else if (vside === VSide.Bottom) this._groupStickySideV = 'top';
		else this._groupStickySideH = null;

		if (hside === HSide.Left) this._groupStickySideH = 'right';
		else if (hside === HSide.Right) this._groupStickySideH = 'left';
		else this._groupStickySideH = null;
	}

	private setPivotAndPosition(object: PIXI.DisplayObject, vside: number, hside: number) {
		// const x = object.x - object.pivot.x * object.scale.x + object.width * hside;
		// const y = object.y - object.pivot.y * object.scale.y + object.height * vside;
		// const pivotx = Math.abs(object.width / object.scale.x) * hside;
		// const pivoty = Math.abs(object.height / object.scale.y) * vside;

		// object.pivot.set(pivotx, pivoty);
		// object.position.set(x, y);
	}

	public handle(e: MouseEvent): void {
		if (!this._object) return;

		const obj = this._object;
		obj.updateTransform();

		if (!this._point) {
			this._point = SelectionUtil.pointFromAreaToGame(e.offsetX, e.offsetY, { x: 0, y: 0 });
		}

		const lastPoint = this._point;
		const newPoint = SelectionUtil.pointFromAreaToGame(e.offsetX, e.offsetY, { x: 0, y: 0 });

		const dx = (lastPoint.x - newPoint.x) * this._hsign;
		const dy = (lastPoint.y - newPoint.y) * this._vsign;

		this._point = newPoint;

		if (e.altKey) {
			if (!this._centered) {
				this.setPivotAndPosition(this._object, VSide.Middle, HSide.Center);
			}
		} else if (this._centered) {
			this.setPivotAndPosition(this._object, this._vside, this._hside);
		}

		this._centered = e.altKey;

		if (e.ctrlKey) {
			const ratio = this._hside === 0.5
				? (obj.height + dy) / obj.height
				: (obj.width + dx) / obj.width;
			obj.width *= ratio;
			obj.height *= ratio;
		} else {
			obj.width += dx;
			obj.height += dy;
		}

		obj.position.x = this._objectProps.x
			- (this._objectProps.pivotX * obj.scale.x) * this._hsign;
		obj.position.y = this._objectProps.y
			- (this._objectProps.pivotY * obj.scale.y) * this._vsign;

		// if (this._isGroup && !this._centered) {
		// 	if (this._groupStickySideH) {
		// 		obj[this._groupStickySideH] = this._objectProps[this._groupStickySideH];
		// 	}
		// 	if (this._groupStickySideV) {
		// 		obj[this._groupStickySideV] = this._objectProps[this._groupStickySideV];
		// 	}
		// }
		obj.updateTransform();
	}

	public stopHandling(): void {
		this._point = null;
		if (!this._object) return;
		const object = this._object;
		const { pivotX, pivotY } = this._objectProps;

		const x = object.x + (pivotX - object.pivot.x) * object.scale.x;
		const y = object.y + (pivotY - object.pivot.y) * object.scale.y;

		object.pivot.set(pivotX, pivotY);
		object.position.set(x, y);
		object.updateTransform();

		this._object = null;
	}
}
