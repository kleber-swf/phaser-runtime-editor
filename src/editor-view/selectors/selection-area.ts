import { PluginConfig, Point } from 'plugin.model';
import { MoveHandler } from './handlers/move.handler';
import { SelectionHandler } from './handlers/selection.handler';
import './selection-area.scss';
import { SelectionUtil } from './selection.util';
import { SelectionView } from './selection/selection.view';

export class SelectionArea extends HTMLElement {
	private game: Phaser.Game;
	private selectionView: SelectionView;

	private selectionHandler: SelectionHandler;
	private moveHandler: MoveHandler;

	private _mouseIsDown = false;
	private _mouseUpPoint: Point = { x: 0, y: 0 };

	// #region Initialization

	public init(game: Phaser.Game) {
		this.game = game;
		SelectionUtil.init(game, this);

		this.createHandlers();
		this.createViews();

		this.addEventListener('mousedown', this.onMouseDown.bind(this));
		this.addEventListener('mouseup', this.onMouseUp.bind(this));
		this.addEventListener('mousemove', this.onMouseMove.bind(this));
	}

	public enable(config: PluginConfig) {
		this.selectionHandler.enable(config.root);
	}

	private createHandlers() {
		this.selectionHandler = new SelectionHandler();
		this.moveHandler = new MoveHandler();
	}

	private createViews() {
		this.selectionView = document.createElement('phred-selection') as SelectionView;
		this.appendChild(this.selectionView);
		this.selectionView.init(this.selectionHandler);
	}

	// #endregion

	// #region Event Handlers

	private onMouseDown(e: MouseEvent) {
		this._mouseIsDown = true;
		console.log('mousedown', e)
		this.selectionHandler.findSelectionCandidate(e);
	}

	private onMouseUp(e: MouseEvent) {
		this._mouseIsDown = false;
		this.selectionHandler.selectCandidate();
		// this.game.add.graphics(point.x, point.y, this.game.world)
		// 	.beginFill(0xFFFF00).drawCircle(0, 0, 20)
		// 	.__skip = true;
	}

	private onMouseMove(e: MouseEvent) {
		// console.log('mousedown', e)
		if (!this._mouseIsDown) return;
	}

	// #endregion
}

customElements.define('phred-selection-area', SelectionArea);
