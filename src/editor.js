export class Editor extends Phaser.Group {
	/**
	 * 
	 * @param {Phaser.Game} game 
	 * @param {Phaser.Group} root
	 */
	constructor(game, root) {
		super(game, null, '_RuntimeEditor_Editor_');
		this.root = root;
		game.add.graphics(0, 0, this)
			.lineStyle(2, 0xFF0000, 0.8)
			.drawRect(0, 0, game.width, game.height);
		this.visible = false;
	}
}