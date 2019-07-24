import { Editor } from './editor';

export class Menu extends Phaser.Group {
	/**
	 * @param {Phaser.Game} game 
	 * @param {Editor} editor 
	 */
	constructor(game, editor) {
		super(game, null, '_RuntimeEditor_Panel_');
		this.editor = editor;
		this.createPanel(game);
	}

	/**
	 * @param {Phaser.Game} game 
	 */
	createPanel(game) {
		var text = game.add.text(0, 0, 'EDIT', { font: '16px "Source Code Pro",Consolas,"Courier New",monospaced', fontWeight: 'bold', fill: '#FFFFFF' }, this);
		text.inputEnabled = true;
		text.input.useHandCursor = true;
		text.events.onInputDown.add(this.toggleEditor, this);
	}

	toggleEditor() {
		this.editor.setVisible(!this.editor.visible);
		// this.game.paused = this.editor.visible;
	}
}