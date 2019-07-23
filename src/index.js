import { Editor } from './editor';
import { Panel } from './panel';

class RuntimeEditor extends Phaser.Plugin {
	/**
	 * 
	 * @param {Phaser.Game} game 
	 * @param {Phaser.Group} group
	 */
	constructor(game, group) {
		super(game, game.plugins);
		this.setup(game, group);
	}

	/**
	 * @param {Phaser.Game} game
	 * @param {Phaser.Group} group 
	 */
	setup(game, group) {
		const editor = new Editor(game, group)
		new Panel(game, editor);
	}
}

Phaser.Plugin.RuntimeEditor = RuntimeEditor;
