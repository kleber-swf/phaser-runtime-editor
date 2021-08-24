export interface ButtonConfig {
	width: number;
	height: number;
	states: ButtonStates;
	selectedStates?: ButtonStates;
	textColor: string;
	fontSize: string;
	selectable?: boolean;
}

export interface ButtonStates {
	up: number;
	over: number;
	down: number;
}

export class Button extends Phaser.Group {
	private readonly config: ButtonConfig;
	private readonly graphics: Phaser.Graphics;
	private _selected: boolean;

	constructor(game: Phaser.Game, text: string, config: ButtonConfig, parent: Phaser.Group) {
		super(game, parent);
		if (config.selectable) {
			config.selectedStates = Object.assign({}, config.states, config.selectedStates);
			this._selected = false;
		}
		this.config = config;
		this.graphics = this.createGraphics(game, config);
		this.createLabel(game, text, config);
		this.setState('up');
	}

	private createGraphics(game: Phaser.Game, config: ButtonConfig) {
		const g = new Phaser.Graphics(game);
		this.add(g);

		g.inputEnabled = true;
		const e = g.events;

		e.onInputOver.add(() => this.setState('over'));
		e.onInputOut.add(() => this.setState('up'), this);
		e.onInputDown.add(() => this.setState('down'));
		e.onInputUp.add(this.onClick, this);

		return g;
	}

	private onClick() {
		if (this.config.selectable) this._selected = !this._selected;
		this.setState(this.graphics.input.pointerOver() ? 'over' : 'up');
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
		this.graphics.clear()
			.beginFill(this._selected ? this.config.selectedStates[state] : this.config.states[state], 1)
			.drawRect(0, 0, this.config.width, this.config.height)
			.endFill();
	}
}