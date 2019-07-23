import { Editor } from "./editor";

export class Panel extends Phaser.Group {
	/**
	 * @param {Phaser.Game} game 
	 * @param {Editor} editor 
	 */
	constructor(game, editor) {
		super(game, game.stage, '_RuntimeEditor_Panel_');
		this.editor = editor;
		this.createPanel(game);
	}

	/**
	 * @param {Phaser.Game} game 
	 */
	createPanel(game) {
		var text = game.add.text(0, 0, 'EDIT', { font: '24px "Source Code Pro",Consolas,"Courier New",monospaced', fontWeight: 'bold', fill: '#FFFFFF' });
		text.inputEnabled = true;
		text.input.useHandCursor = true;
		text.events.onInputDown.add(this.toggleEditor, this);
	}

	toggleEditor() {
		this.editor.visible = !this.editor.visible;
		this.game.paused = this.editor.visible;
	}
}