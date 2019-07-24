import { Editor } from './editor';
import { Menu } from './menu';
import _defs from './_defs';

class RuntimeEditor extends Phaser.Plugin {
	/**
	 * 
	 * @param {Phaser.Game} game 
	 * @param {Phaser.Group} group
	 */
	constructor(game, group) {
		super(game, game.plugins);
		_defs();
		this.setup(game, group);
	}

	/**
	 * @param {Phaser.Game} game
	 * @param {Phaser.Group} group 
	 */
	setup(game, group) {
		const editor = new Editor(game, group)
		const menu = new Menu(game, editor);
		game.stage.add(editor);
		game.stage.add(menu);
	}
}

Phaser.Plugin.RuntimeEditor = RuntimeEditor;
