import { PluginConfig } from 'plugin.model';
import { Gizmo } from './gizmo/gizmo';
import { MoveHandler } from './handlers/move.handler';
import { SelectionHandler } from './handlers/selection.handler';
import { Selection } from './selection';
import './selection-area.scss';
import { SelectionUtil } from './selection.util';

const INTERVAL = 1000 / 60;	// FPS

export class SelectionArea extends HTMLElement {
	private gizmo: Gizmo;
	private interval: any;

	private selection: Selection;
	private selectionHandler: SelectionHandler;
	private moveHandler: MoveHandler;


	// #region Initialization

	public init(game: Phaser.Game) {
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
		this.interval = setInterval(this.update.bind(this), INTERVAL);
	}

	private createHandlers(selection: Selection) {
		this.selectionHandler = new SelectionHandler(selection);
		this.moveHandler = new MoveHandler(selection);
	}

	private createViews(selection: Selection) {
		this.gizmo = document.createElement('phred-selection') as Gizmo;
		this.appendChild(this.gizmo);
		this.gizmo.init(selection);
	}

	// #endregion

	private update() {
		if (this.selection.object) {
			this.gizmo.redraw(this.selection.object);
		}
	}

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
