export class EditorView extends Phaser.Group {
	private readonly touchArea: Phaser.Graphics;
	private readonly container: Phaser.Group | Phaser.Stage;

	constructor(game: Phaser.Game, container: Phaser.Group | Phaser.Stage, parent: Phaser.Group | Phaser.Stage) {
		super(game, parent);
		this.container = container;
		this.touchArea = this.createTouchArea(game);
		this.redrawTouchArea();
	}

	private createTouchArea(game: Phaser.Game) {
		const graphics = new Phaser.Graphics(game);
		graphics.inputEnabled = true;
		graphics.events.onInputUp.add(this.onTouch, this);
		game.scale.onSizeChange.add(this.redrawTouchArea, this);
		this.add(graphics);
		return graphics;
	}

	private redrawTouchArea() {
		const sm = this.game.scale;
		this.touchArea.clear()
			.beginFill(0, 0)
			.drawRect(0, 0, sm.width, sm.height)
			.endFill();
	}

	private onTouch(_: any, pointer: Phaser.Pointer) {
		
	}

	private getObjectsUnderPoint(x: number, y: number) {
		
	}
}