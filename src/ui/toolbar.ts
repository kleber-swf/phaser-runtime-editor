import { Button } from './button';

export class ToolBar extends Phaser.Group {
	constructor(game: Phaser.Game, parent: Phaser.Group) {
		super(game, parent);
		const button = new Button(game, 'EDIT', {
			width: 50, height: 20,
			states: {
				up: { fill: 0x00548C, alpha: 0.5 },
				over: { fill: 0x00548C },
				down: { fill: 0x001F33 }
			},
			fontSize: '10px',
			textColor: '#FFFFFF',
		}, this);
	}
}

