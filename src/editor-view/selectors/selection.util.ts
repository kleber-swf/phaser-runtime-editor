import { Point } from 'plugin.model';

class SelectionUtilClass {
	private game: Phaser.Game;
	private selectionArea: HTMLElement;

	public init(game: Phaser.Game, selectionArea: HTMLElement) {
		this.game = game;
		this.selectionArea = selectionArea;
	}

	public pointFromAreaToGame(x: number, y: number, out: Point) {
		out.x = this.game.width * x / this.selectionArea.clientWidth;
		out.y = this.game.height * y / this.selectionArea.clientHeight;
	}
}

export const SelectionUtil = new SelectionUtilClass();