export class Editor extends Phaser.Group {
	/**
	 * 
	 * @param {Phaser.Game} game 
	 * @param {Phaser.Group} root
	 */
	constructor(game, root) {
		super(game, game.stage, '_RuntimeEditor_Editor_');
		this.root = root;
		game.add.graphics(0, 0, this)
			.beginFill(0, 0.2)
			.drawRect(0, 0, game.width, game.height)
			.endFill();
		this.visible = false;
	}
}