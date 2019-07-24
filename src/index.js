import { EditorContainer } from './editor.container';
import { Menu } from './menu';
import _defs from './_defs';

class RuntimeEditor extends Phaser.Plugin {
	/**
	 * @param {Phaser.Game} game 
	 * @param {Phaser.Group} group
	 */
	constructor(game, group) {
		super(game, game.plugins);
		this.group = group;
		this.container = null;
		_defs();

		const menu = new Menu(game);
		menu.edit.events.onInputDown.add(this.toggleEditor, this);
		game.stage.add(menu);
		this.menu = menu;
	}

	toggleEditor() {
		if (!this.container) {
			this.container = new EditorContainer(this.game, this.group);
			this.game.stage.add(this.container);
		}
		this.container.toggleVisible();
		this.game.stage.setChildIndex(this.menu, this.game.stage.children.length - 1);
	}
}

Phaser.Plugin.RuntimeEditor = RuntimeEditor;
