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
		this.addEventListener('mouseup', this.onMouseUp.bind(this))
	}

	private onMouseUp(e: PointerEvent) {
		const game = this.game;
		const point = this._touchPoint;
		const target = e.target as HTMLElement;

		SelectionUtil.pointFromAreaToGame(
			target.offsetLeft + e.offsetX,
			target.offsetTop + e.offsetY,
			point);

		game.add.graphics(point.x, point.y, this.game.world)
			.beginFill(0xFFFF00).drawCircle(0, 0, 20)
			.__skip = true;

		const obj = this.selector.getObjectAt(point.x, point.y);
		this.selection.object = obj;
	}
}

customElements.define('phred-selection-area', SelectionArea);
