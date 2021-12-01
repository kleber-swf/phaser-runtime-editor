import './selection-area.scss';
import { NewSelection } from './selection/selection';

export class SelectionArea extends HTMLElement {
	public game: Phaser.Game;
	private selection: NewSelection;

	// TODO move it to init / enable
	public connectedCallback() {
		this.selection = document.createElement('phred-selection') as NewSelection;
		this.appendChild(this.selection);
		this.addEventListener('click', this.onClick.bind(this))
	}

	private onClick(e: PointerEvent) {
		const game = this.game;
		const gx = game.width * e.offsetX / this.clientWidth;
		const gy = game.height * e.offsetY / this.clientHeight;

		game.add.graphics(gx, gy)
			.beginFill(0xFFFF00).drawCircle(0, 0, 20);
	}
}

customElements.define('phred-selection-area', SelectionArea);
