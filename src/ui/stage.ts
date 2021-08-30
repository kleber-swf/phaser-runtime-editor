import { ActionsToolbar } from './actions/actions-toolbar';
import { PropertiesToolbar } from './properties/toolbar/properties-toolbar';
import { Widget } from './widget/widget';

import './stage.scss';

export class Stage extends Widget {
	public static readonly tagName = 'phred-stage';

	private _game: Phaser.Game;
	private actions: ActionsToolbar;
	private gameContainer: HTMLElement;
	private properties: PropertiesToolbar;

	public get game() { return this._game; }

	public set game(game: Phaser.Game) {
		if (game) {
			const el = game.canvas.parentElement;
			el.classList.add('phred-game');
			this.gameContainer.appendChild(el);
		} else if (this._game) {
			const el = this._game.canvas.parentElement;
			el.classList.remove('phred-game');
			this.gameContainer.removeChild(el);
		}
		this._game = game;
	}

	public connectedCallback() {
		super.connectedCallback();

		const content = document.createElement('div');
		content.classList.add('phred-content');
		this.appendChild(content);

		this.actions = document.createElement(ActionsToolbar.tagName) as ActionsToolbar;
		content.appendChild(this.actions);

		this.gameContainer = document.createElement('div');
		this.gameContainer.classList.add('phred-game-container');
		content.appendChild(this.gameContainer);

		this.properties = document.createElement(PropertiesToolbar.tagName) as PropertiesToolbar;
		this.appendChild(this.properties);
	}

	public selectObject(obj: PIXI.DisplayObject) {
		this.properties.selectObject(obj);
	}
}

customElements.define(Stage.tagName, Stage);
