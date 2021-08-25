import { ActionsToolbar } from './actions.toolbar';
import { PropertiesToolbar } from './properties.toolbar';

export class Stage extends HTMLElement {
	public static eid = 'phred-stage';

	private _game: Phaser.Game;
	private _actions: ActionsToolbar;
	private _content: HTMLElement;
	private _properties: PropertiesToolbar;

	public get game() { return this._game; }

	public set game(game: Phaser.Game) {
		if (game) {
			const el = game.canvas.parentElement;
			el.classList.add('phred-game');
			this._content.appendChild(el);
		} else if (this._game) {
			const el = this._game.canvas.parentElement;
			el.classList.remove('phred-game');
			this._content.removeChild(el);
		}
		this._game = game;
	}

	public connectedCallback() {
		const content = this._content = document.createElement('div');
		content.classList.add('phred-content');
		this.appendChild(content);

		this._actions = document.createElement(ActionsToolbar.eid);
		content.appendChild(this._actions);

		this._properties = document.createElement(PropertiesToolbar.eid);
		this.appendChild(this._properties);
	}
}

customElements.define(Stage.eid, Stage);
