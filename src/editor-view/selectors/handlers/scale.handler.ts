import { Editor } from 'core/editor';
import { DataOrigin } from 'data/editor-data';
import { Math as PMath } from 'phaser-ce';
import { Point } from 'plugin.model';
import { HSide, VSide } from '../gizmos/gizmo';
import { ScaleGizmo } from '../gizmos/scale-gizmo';
import { SelectionUtil } from '../selection.util';
import { DraggingHandler } from './dragging-handler';

export class ScaleHandler implements DraggingHandler {
	private _point: Point;
	private _object: PIXI.DisplayObject;

	private _vside: VSide;
	private _hside: HSide;
	private _hsign = 0;
	private _vsign = 0;
	private _normalizedPivot: Point;

	// XXX Hack to make (non-renderable objects) work properly. Since their position may differ than
	// their visual corners, this hack helps to keep them.
	// TODO find a better way to make this, like using the difference between the top and y
	private _groupStickySideHKey: string;
	private _groupStickySideVKey: string;
	private _groupStickySideHValue: number;
	private _groupStickySideVValue: number;

	public startHandling(e: MouseEvent, object: PIXI.DisplayObject): void {
		const gizmo = e.target as ScaleGizmo;
		let hside = gizmo.hside;
		let vside = gizmo.vside;

		if (hside === undefined || vside === undefined) {
			this._object = null;
			return;
		}

		this._object = object;

		// inverting axis when scale is negative
		if (object.scale.x < 0) hside = Math.abs(hside - 1);
		if (object.scale.y < 0) vside = Math.abs(vside - 1);

		this._vside = vside;
		this._hside = hside;

		object.updateTransform();

		this._normalizedPivot = {
			x: (object.pivot.x / (object.width / object.scale.x)),
			y: (object.pivot.y / (object.height / object.scale.y)),
		};

		this._vsign = Math.sign(vside - 0.5);
		this._hsign = Math.sign(hside - 0.5);

		if (object.renderable) return;

		if (vside === VSide.Top) this._groupStickySideVKey = 'bottom';
		else if (vside === VSide.Bottom) this._groupStickySideVKey = 'top';
		else this._groupStickySideVKey = null;

		if (hside === HSide.Left) this._groupStickySideHKey = 'right';
		else if (hside === HSide.Right) this._groupStickySideHKey = 'left';
		else this._groupStickySideHKey = null;

		this._groupStickySideVValue = this._groupStickySideVKey ? object[this._groupStickySideVKey] : null;
		this._groupStickySideHValue = this._groupStickySideHKey ? object[this._groupStickySideHKey] : null;
	}

	public handle(e: MouseEvent): void {
		if (!this._object) return;

		const object = this._object;
		object.updateTransform();

		if (!this._point) {
			this._point = SelectionUtil.pointFromAreaToGame(e.offsetX, e.offsetY, { x: 0, y: 0 });
		}

		const lastPoint = this._point;
		const newPoint = SelectionUtil.pointFromAreaToGame(e.offsetX, e.offsetY, { x: 0, y: 0 });
		const centered = e.altKey;

		let hratio: number;
		let vratio: number;
		let dscale: number;

		if (centered) {
			hratio = this._normalizedPivot.x - HSide.Center;
			vratio = this._normalizedPivot.y - VSide.Middle;
			dscale = 2;
		} else {
			hratio = this._normalizedPivot.x - this._hside;
			vratio = this._normalizedPivot.y - this._vside;
			dscale = 1;
		}

		const scale = object.worldScale.clone();
		scale.x /= object.scale.x;
		scale.y /= object.scale.y;

		let dx = ((lastPoint.x - newPoint.x) * this._hsign * dscale) / scale.x;
		let dy = ((lastPoint.y - newPoint.y) * this._vsign * dscale) / scale.y;
		this._point = newPoint;

		if (e.ctrlKey) {
			if (this._hside === 0.5) dx = dy;
			else dy = dx;
		}

		object.width = PMath.roundTo(object.width + dx, -2);
		object.height = PMath.roundTo(object.height + dy, -2);
		object.x = PMath.roundTo(object.x + dx * hratio, -2);
		object.y = PMath.roundTo(object.y + dy * vratio, -2);

		if (!(object.renderable || centered)) {
			if (this._groupStickySideVKey) object[this._groupStickySideVKey] = this._groupStickySideVValue;
			if (this._groupStickySideHKey) object[this._groupStickySideHKey] = this._groupStickySideHValue;
		}
		object.updateTransform();

		Editor.data.propertyChanged('scale', object.scale, DataOrigin.SCENE);
		Editor.data.propertyChanged('position', object.position, DataOrigin.SCENE);
		Editor.data.propertyChanged('_bounds', object.getBounds(), DataOrigin.SCENE);
	}

	public stopHandling(): void {
		this._point = null;
		this._object = null;
	}
}
