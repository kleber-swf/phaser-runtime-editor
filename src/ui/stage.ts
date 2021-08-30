import { ActionsToolbar } from './actions-toolbar/actions-toolbar';
import { PropertiesToolbar } from './properties/toolbar/properties-toolbar';
import { Widget } from './widget';
import './stage.scss';

export class Stage extends Widget {
	public static readonly tagId = 'phred-stage';

	private _game: Phaser.Game;
	private _actions: ActionsToolbar;
	private _gameContainer: HTMLElement;
	private _properties: PropertiesToolbar;

	public get game() { return this._game; }

	public set game(game: Phaser.Game) {
		if (game) {
			const el = game.canvas.parentElement;
			el.classList.add('phred-game');
			this._gameContainer.appendChild(el);
		} else if (this._game) {
			const el = this._game.canvas.parentElement;
			el.classList.remove('phred-game');
			this._gameContainer.removeChild(el);
		}
		this._game = game;
	}

	public connectedCallback() {
		super.connectedCallback();

		const content = document.createElement('div');
		content.classList.add('phred-content');
		this.appendChild(content);

		this._actions = document.createElement(ActionsToolbar.tagId) as ActionsToolbar;
		content.appendChild(this._actions);

		this._gameContainer = document.createElement('div');
		this._gameContainer.classList.add('phred-game-container');
		content.appendChild(this._gameContainer);

		this._properties = document.createElement(PropertiesToolbar.tagId) as PropertiesToolbar;
		this.appendChild(this._properties);
	}
}

customElements.define(Stage.tagId, Stage);
