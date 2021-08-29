import { BORDER_COLOR, BORDER_STROKE } from '../../editor.colors';

export class ScaleKnob extends Phaser.Graphics {
	constructor(game: Phaser.Game, public readonly factorH: number, public readonly factorV: number) {
		super(game);
		this.__skip = true;
		this.lineStyle(2, BORDER_STROKE, 1)
			.beginFill(BORDER_COLOR, 1)
			.drawCircle(0, 0, 16);
		this.inputEnabled = true;
	}
}