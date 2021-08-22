export interface ButtonConfig {
	width: number;
	height: number;
	states: ButtonStates;
	textColor: string;
	fontSize: string;
}

export interface ButtonState {
	fill: number;
	alpha?: number;
}

export interface ButtonStates {
	up: ButtonState;
	over: ButtonState;
	down: ButtonState;
}

export class Button extends Phaser.Group {
	private readonly graphics: Phaser.Graphics;

	constructor(game: Phaser.Game, text: string, private readonly config: ButtonConfig, parent: Phaser.Group) {
		super(game, parent);
		this.graphics = this.createGraphics(game, config);
		this.createLabel(game, text, config);
		this.setState('up');
	}

	private createGraphics(game: Phaser.Game, config: ButtonConfig) {
		const g = new Phaser.Graphics(game).beginFill(0, 1).drawRect(0, 0, config.width, config.height).endFill();
		this.add(g);

		g.inputEnabled = true;
		const e = g.events;

		e.onInputOver.add(() => this.setState('over'));
		e.onInputOut.add(() => this.setState('up'));
		e.onInputDown.add(() => this.setState('down'));
		e.onInputUp.add(() => this.setState(g.input.pointerOver() ? 'over' : 'up'));

		return g;
	}

	private createLabel(game: Phaser.Game, text: string, config: ButtonConfig) {
		const px = config.width * 0.5;
		const py = config.height * 0.5;
		const label = new Phaser.Text(game, 0, 0, text, {
			font: `bold ${config.fontSize} sans-serif`,
			fill: config.textColor,
			align: 'center',
		});
		label.anchor.set(0.5, 0.5);
		label.position.set(px, py + 2);
		this.add(label);
		return label;
	}

	private setState(state: keyof ButtonStates) {
		const st = this.config.states[state];
		this.graphics.clear()
			.beginFill(st.fill, st.alpha)
			.drawRect(0, 0, this.config.width, this.config.height)
			.endFill();
	}
}