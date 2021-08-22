import { Button } from './button';

export class ToolBar extends Phaser.Group {
	constructor(game: Phaser.Game, parent: Phaser.Group) {
		super(game, parent);
		const button = new Button(game, 'EDIT', {
			width: 50, height: 20,
			states: { up: 0xBBBBBB, over: 0xFFFFFF, down: 0xCCCCCC },
			fontSize: '10px',
			textColor: '#FFFFFF',
		}, this);
	}
}

