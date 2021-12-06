import { Editor } from 'core/editor';
import { DataOrigin } from 'data/editor-data';
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

		const object = this._object;
		const scale = object.worldScale.clone();

		scale.x /= object.scale.x;
		scale.y /= object.scale.y;

		const dx = (newPoint.x - lastPoint.x) / scale.x;
		const dy = (newPoint.y - lastPoint.y) / scale.y;

		this._point = newPoint;

		object.position.set(
			object.x + dx,
			object.y + dy
		);

		object.updateTransform();
		Editor.data.propertyChanged('position', object.position, DataOrigin.SCENE);
		Editor.data.propertyChanged('_bounds', object.getBounds(), DataOrigin.SCENE);
	}

	public stopHandling() { this._object = null; }
}
