import { Point } from 'plugin.model';
import { Selection } from '../selection';
import { SelectionUtil } from '../selection.util';

export class MoveHandler {
	private readonly selection: Selection;
	private _point: Point = { x: 0, y: 0 };

	public constructor(selection: Selection) {
		this.selection = selection;
	}

	public startMoving(e: MouseEvent) {
		SelectionUtil.mouseEventToGamePoint(e, this._point);
	}

	public move(e: MouseEvent) {
		const lastPoint = this._point;
		const newPoint = SelectionUtil.mouseEventToGamePoint(e, { x: 0, y: 0 });

		const dx = newPoint.x - lastPoint.x
		const dy = newPoint.y - lastPoint.y
		this._point = newPoint;

		const object = this.selection.object;
		object.position.set(object.x + dx, object.y + dy);
	}
}
