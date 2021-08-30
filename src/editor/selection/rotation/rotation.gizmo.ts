export class RotationGizmo extends Phaser.Graphics {
	constructor(game: Phaser.Game) {
		super(game);
		this.__skip = true;
		this
			.beginFill(0, 0)
			.drawCircle(0, 0, 18)
			.endFill()
			.lineStyle(2, 0xFFFFFF, 1)
			.beginFill(0x1ABC9C, 1)
			.drawCircle(0, 0, 14);

		this.inputEnabled = true;
	}
}