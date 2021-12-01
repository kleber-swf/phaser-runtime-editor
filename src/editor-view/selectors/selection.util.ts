import { Point, Rect } from 'plugin.model';

class SelectionUtilClass {
	private game: Phaser.Game;
	private selectionArea: HTMLElement;

	public init(game: Phaser.Game, selectionArea: HTMLElement) {
		this.game = game;
		this.selectionArea = selectionArea;
	}

	public pointFromAreaToGame(x: number, y: number, out: Point) {
		// gx = ax * gw/aw;
		out.x = x * this.game.width / this.selectionArea.clientWidth;
		out.y = y * this.game.height / this.selectionArea.clientHeight;
	}

	public rectFromGameToArea(g: PIXI.Rectangle, a: Rect) {
		// ax = gx * aw/gw
		const hr = this.selectionArea.clientWidth / this.game.width;
		const vr = this.selectionArea.clientHeight / this.game.height;

		a.x = g.x * hr;
		a.y = g.y * vr;
		a.width = g.width * hr;
		a.height = g.height * vr;
	}
}

export const SelectionUtil = new SelectionUtilClass();