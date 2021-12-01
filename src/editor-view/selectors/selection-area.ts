import './selection-area.scss';
import { NewSelection } from './selection/selection';

export class SelectionArea extends HTMLElement {
	public zoom = 1;
	private selection: NewSelection;

	private _game: Phaser.Game;
	private _scaleFactor: { x: number, y: number };

	public set game(value: Phaser.Game) {
		this._game = value;
		// TODO investigate why this needed
		setTimeout(() => {
			const sf = value.scale.scaleFactor;
			this._scaleFactor = { x: sf.x, y: sf.y };
		}, 100);
	}

	connectedCallback() {
		this.selection = document.createElement('phred-selection') as NewSelection;
		this.appendChild(this.selection);
		this.addEventListener('click', this.onClick.bind(this))
	}

	private onClick(e: PointerEvent) {
		const game = this._game;

		console.log(e.offsetX, e.offsetY, this.zoom);
		const sf = this._scaleFactor;

		// TODO there is a slight difference with zoom >= ~2.5x. Why?
		game.add.graphics(e.offsetX * sf.x, e.offsetY * sf.y)
			.beginFill(0xFFFF00).drawCircle(0, 0, 20);
	}
}

customElements.define('phred-selection-area', SelectionArea);
