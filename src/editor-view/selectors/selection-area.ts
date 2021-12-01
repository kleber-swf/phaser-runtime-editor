import { PluginConfig, Point } from 'plugin.model';
import { ObjectSelector } from './object-selector';
import './selection-area.scss';
import { SelectionUtil } from './selection.util';
import { NewSelection } from './selection/new-selection';

export class SelectionArea extends HTMLElement {
	private game: Phaser.Game;
	private selection: NewSelection;
	private selector: ObjectSelector;
	private _touchPoint: Point = { x: 0, y: 0 };

	public init(game: Phaser.Game, config: PluginConfig) {
		this.game = game;
		SelectionUtil.init(game, this);
		this.selector = new ObjectSelector(config.root);
		this.selection = document.createElement('phred-selection') as NewSelection;
		this.selection.init();
	}

	// TODO move it to init / enable
	public connectedCallback() {
		this.appendChild(this.selection);
		this.addEventListener('click', this.onClick.bind(this))
	}

	private onClick(e: PointerEvent) {
		const game = this.game;
		const p = this._touchPoint;
		SelectionUtil.pointFromAreaToGame(e.offsetX, e.offsetY, p);

		game.add.graphics(p.x, p.y)
			.beginFill(0xFFFF00).drawCircle(0, 0, 20);

		const obj = this.selector.getObjectAt(p.x, p.y);
		this.selection.object = obj;
	}
}

customElements.define('phred-selection-area', SelectionArea);
