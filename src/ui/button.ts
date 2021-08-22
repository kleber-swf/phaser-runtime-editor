export interface ButtonConfig {
	width: number;
	height: number;
	states: ButtonStates;
	textColor: string;
	fontSize: string;
}

export interface ButtonStates {
	up: number;
	over: number;
	down: number;
}

export class Button extends Phaser.Group {
	private readonly graphics: Phaser.Graphics;
	private readonly label: Phaser.Text;
	private readonly config: ButtonConfig;

	constructor(game: Phaser.Game, text: string, config: ButtonConfig, parent: Phaser.Group) {
		super(game, parent);
		// this.states = config.states;
		this.graphics = Button.createGraphics(game, config, this);
		this.label = Button.createLabel(game, text, config, this);
	}

	private static createGraphics(game: Phaser.Game, config: ButtonConfig, parent: Phaser.Group) {
		const graphics = new Phaser.Graphics(game).beginFill(0, 1).drawRect(0, 0, config.width, config.height).endFill();
		parent.add(graphics);
		return graphics;
	}

	private static createLabel(game: Phaser.Game, text: string, config: ButtonConfig, parent: Phaser.Group) {
		const px = config.width * 0.5;
		const py = config.height * 0.5;
		const label = new Phaser.Text(game, 0, 0, text, {
			font: `bold ${config.fontSize} sans-serif`,
			fill: config.textColor,
			align: 'center',
		});
		label.anchor.set(0.5, 0.5);
		label.position.set(px, py + 2);
		parent.add(label);
		return label;
	}
}