import { Editor } from './editor';

export class Menu extends Phaser.Group {
	/**
	 * @param {Phaser.Game} game 
	 * @param {Editor} editor 
	 */
	constructor(game) {
		super(game, null, '_RuntimeEditor_Panel_');
		this.edit = this.createItem(0, 0, 'EDIT');
	}

	/**
	 * @param {number} x 
	 * @param {number} y 
	 * @param {string} text 
	 */
	createItem(x, y, text) {
		var label = this.game.add.text(x, y, text, { font: '16px "Source Code Pro",Consolas,"Courier New",monospaced', fontWeight: 'bold', fill: '#FFFFFF' }, this);
		label.inputEnabled = true;
		label.input.useHandCursor = true;
		return label;
	}
}