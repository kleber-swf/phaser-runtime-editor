import { ToolBar } from './toolbar';

export class Stage extends HTMLElement {
	private _game: Phaser.Game;
	private _toolbar: ToolBar;
	private _gameCol: HTMLElement;

	public get game() { return this._game; }

	public set game(game: Phaser.Game) {
		if (game) {
			const el = game.canvas.parentElement;
			el.classList.add('pre-game');
			this._gameCol.appendChild(el);
		} else if (this._game) {
			const el = this._game.canvas.parentElement;
			el.classList.remove('pre-game');
			this._gameCol.removeChild(el);
		}
		this._game = game;
	}

	public connectedCallback() {
		const gameCol = this._gameCol = document.createElement('div');
		gameCol.classList.add('pre-game-col');
		this.appendChild(gameCol);

		this._toolbar = document.createElement('pre-toolbar');
		gameCol.appendChild(this._toolbar);
	}
}

customElements.define('pre-stage', Stage);