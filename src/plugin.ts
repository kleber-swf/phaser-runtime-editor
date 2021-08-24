import Phaser from 'phaser-ce';
import { Stage } from './stage';

export class Plugin extends Phaser.Plugin {
	public constructor(game: Phaser.Game, group?: Phaser.Group | Phaser.Stage) {
		super(game, game.plugins);
		const stage = new Stage(game, group, game.stage);
		// this.container = null;
		// _defs();

		// const menu = new Menu(game);
		// menu.edit.events.onInputDown.add(this.toggleEditor, this);
		// game.stage.add(menu);
		// this.menu = menu;
	}

	// toggleEditor() {
	// 	if (!this.container) {
	// 		this.container = new EditorContainer(this.game, this.group);
	// 		this.game.stage.add(this.container);
	// 	}
	// 	this.container.toggleVisible();
	// 	this.game.stage.setChildIndex(this.menu, this.game.stage.children.length - 1);
	// }
}

// Phaser.Plugin.RuntimeEditor = RuntimeEditor;
