import { PluginConfig, Point } from 'plugin.model';
import { MoveHandler } from './handlers/move.handler';
import { SelectionHandler } from './handlers/selection.handler';
import { Selection } from './selection';
import './selection-area.scss';
import { SelectionUtil } from './selection.util';
import { SelectionView } from './selection/selection.view';

export class SelectionArea extends HTMLElement {
	private game: Phaser.Game;
	private selectionView: SelectionView;

	private selection: Selection;
	private selectionHandler: SelectionHandler;
	private moveHandler: MoveHandler;

	private _mouseIsDown = false;
	private _touchPoint: Point = { x: 0, y: 0 };

	// #region Initialization

	public init(game: Phaser.Game, config: PluginConfig) {
		this.game = game;
		SelectionUtil.init(game, this);

		this.createHandlers(config.root);
		this.createViews();

		this.addEventListener('mousedown', this.onMouseDown.bind(this));
		this.addEventListener('mouseup', this.onMouseUp.bind(this));
		this.addEventListener('mousemove', this.onMouseMove.bind(this));
	}

	private createHandlers(root: Container) {
		this.selection = new Selection();
		this.selectionHandler = new SelectionHandler(root);
		this.moveHandler = new MoveHandler();
	}

	private createViews() {
		this.selectionView = document.createElement('phred-selection') as SelectionView;
		this.appendChild(this.selectionView);
		this.selectionView.init(this.selection);
	}

	// #endregion

	// #region Event Handlers

	private onMouseDown(e: MouseEvent) {
		this._mouseIsDown = true;
		console.log('mousedown', e)
	}

	private onMouseUp(e: MouseEvent) {
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

		const obj = this.selectionHandler.getObjectAt(point.x, point.y);
		this.selection.object = obj;
	}

	private onMouseMove(e: MouseEvent) {
		// console.log('mousedown', e)
	}

	// #endregion
}

customElements.define('phred-selection-area', SelectionArea);
