import { Editor } from './editor';
import { Menu } from './menu';
import _defs from './_defs';
import { PropertiesPanel } from './properties.panel';

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
		const panel = new PropertiesPanel(game, 'Properties');

		game.stage.add(editor);
		game.stage.add(menu);
		game.stage.add(panel);
		panel.position.set(game.scale.getParentBounds().width - panel.width, 0);

		editor.onObjectSelected.add(panel.onObjectSelected, panel);
	}
}

Phaser.Plugin.RuntimeEditor = RuntimeEditor;
