import { Button } from './button';

export class ToolBar extends Phaser.Group {
	constructor(game: Phaser.Game, parent: Phaser.Group) {
		super(game, parent);
		const button = new Button(game, 'EDIT', {
			width: 50, height: 20, fontSize: '10px', textColor: '#FFFFFF',
			selectable: true,
			states: { up: 0x37474F, over: 0x78909C, down: 0x78909C, },
			selectedStates: { up: 0xA74D4B, over: 0xF56462, down: 0xF56462, },
		}, this);
	}
}

