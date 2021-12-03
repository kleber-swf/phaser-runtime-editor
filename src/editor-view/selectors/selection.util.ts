import { Point, Rect } from 'plugin.model';

class SelectionUtilClass {
	private game: Phaser.Game;
	private selectionArea: HTMLElement;

	public init(game: Phaser.Game, selectionArea: HTMLElement) {
		this.game = game;
		this.selectionArea = selectionArea;
	}

	public mouseEventToGamePoint(e: MouseEvent, out: Point) {
		// TODO test if offsetLeft/offsetRight is different than 0
		return SelectionUtil.pointFromAreaToGame(
			(e.target as HTMLElement).offsetLeft + e.offsetX,
			(e.target as HTMLElement).offsetTop + e.offsetY,
			out
		);
	}

	public pointFromAreaToGame(x: number, y: number, out: Point) {
		// gx = ax * gw/aw;
		out.x = (x * this.game.width) / this.selectionArea.clientWidth;
		out.y = (y * this.game.height) / this.selectionArea.clientHeight;
		return out;
	}

	public rectFromGameToArea(rect: PIXI.Rectangle, out: Rect) {
		// ax = gx * aw/gw
		const hr = this.selectionArea.clientWidth / this.game.width;
		const vr = this.selectionArea.clientHeight / this.game.height;

		out.x = rect.x * hr;
		out.y = rect.y * vr;
		out.width = rect.width * hr;
		out.height = rect.height * vr;

		return out;
	}
}

export const SelectionUtil = new SelectionUtilClass();
