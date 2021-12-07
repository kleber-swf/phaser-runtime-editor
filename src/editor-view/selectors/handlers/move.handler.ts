import { Editor } from 'core/editor';
import { DataOrigin } from 'data/editor-data';
import { Point } from 'plugin.model';
import { SelectionUtil } from '../selection.util';
import { DraggingHandler } from './dragging-handler';

export class MoveHandler implements DraggingHandler {
	private _point: Point = { x: 0, y: 0 };
	private _object: PIXI.DisplayObject;
	private _moveFn: (obj: PIXI.DisplayObject, x: number, y: number) => void;

	public snap(object: PIXI.DisplayObject, value: boolean) {
		this._moveFn = value ? this.snapMove.bind(this) : this.freeMove.bind(this);
		if (object) this._moveFn(object, object.x, object.y);
	}

	public constructor() { this._moveFn = this.freeMove; }

	public startHandling(e: MouseEvent, object: PIXI.DisplayObject) {
		this._object = object;
		SelectionUtil.mouseEventToGamePoint(e, this._point);
	}

	public handle(e: MouseEvent) {
		const lastPoint = this._point;
		const newPoint = SelectionUtil.mouseEventToGamePoint(e, { x: 0, y: 0 });

		const object = this._object;
		const scale = object.worldScale.clone();

		scale.x = Math.abs(scale.x / object.scale.x);
		scale.y = Math.abs(scale.y / object.scale.y);

		const dx = (newPoint.x - lastPoint.x) / scale.x;
		const dy = (newPoint.y - lastPoint.y) / scale.y;

		this._point = newPoint;
		this._moveFn(object, object.x + dx, object.y + dy);
	}

	private freeMove(object: PIXI.DisplayObject, x: number, y: number) {
		object.position.set(x, y);
		this.updateObjectTransform(object);
	}

	private snapMove(object: PIXI.DisplayObject, x: number, y: number) {
		object.position.set(Math.round(x), Math.round(y));
		this.updateObjectTransform(object);
	}

	private updateObjectTransform(object: PIXI.DisplayObject) {
		object.updateTransform();
		Editor.data.propertyChanged('position', object.position, DataOrigin.SCENE);
		Editor.data.propertyChanged('_bounds', object.getBounds(), DataOrigin.SCENE);
	}

	public stopHandling() { this._object = null; }
}
