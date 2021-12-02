import { PluginConfig } from 'plugin.model';
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

	// #region Initialization

	public init(game: Phaser.Game) {
		this.game = game;
		SelectionUtil.init(game, this);

		this.selection = new Selection();
		this.createHandlers(this.selection);
		this.createViews(this.selection);

		this.addEventListener('mousedown', this.onMouseDown.bind(this));
		this.addEventListener('mouseup', this.onMouseUp.bind(this));
		this.addEventListener('mousemove', this.onMouseMove.bind(this));
	}

	public enable(config: PluginConfig) {
		this.selectionHandler.enable(config.root);
	}

	private createHandlers(selection: Selection) {
		this.selectionHandler = new SelectionHandler(selection);
		this.moveHandler = new MoveHandler(selection);
	}

	private createViews(selection: Selection) {
		this.selectionView = document.createElement('phred-selection') as SelectionView;
		this.appendChild(this.selectionView);
		this.selectionView.init(selection);
	}

	// #endregion

	// #region Event Handlers

	private _mouseIsDown = false;
	private _isDragging = false;
	private _hasSelection = false;

	private onMouseDown(e: MouseEvent) {
		this._mouseIsDown = true;
		this._isDragging = false;
		this._hasSelection = this.selectionHandler.isOverSelection(e);
	}

	private onMouseUp(e: MouseEvent) {
		this._mouseIsDown = false;
		if (!(this._hasSelection && this._isDragging)) {
			this._hasSelection = this.selectionHandler.selectAt(e);
		}
		this._isDragging = false;
	}

	private onMouseMove(e: MouseEvent) {
		if (!this._mouseIsDown) return;
		if (!this._isDragging) {
			this._isDragging = true;
			if (!this._hasSelection) {
				this._hasSelection = this.selectionHandler.selectAt(e);
			}
			this.moveHandler.startMoving(e);
		}
		this.moveHandler.move(e);
	}

	// #endregion
}

customElements.define('phred-selection-area', SelectionArea);
