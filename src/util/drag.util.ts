// TODO should this be relative to screen size, game scale or something?
const SQUARED_DRAG_DISTANCE = 10 * 10;

export class DragUtil {
	public static shouldStartDrag(pointer: Phaser.Pointer) {
		const dx = pointer.x - pointer.positionDown.x;
		const dy = pointer.y - pointer.positionDown.y;
		const dist = dx * dx + dy * dy;
		return dist > SQUARED_DRAG_DISTANCE;
	}
}
