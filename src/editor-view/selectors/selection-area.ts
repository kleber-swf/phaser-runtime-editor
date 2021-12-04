import { PluginConfig } from 'plugin.model';
import { Gizmo, GIZMO_MOVE, GIZMO_ROTATION, GIZMO_SCALE } from './gizmos/gizmo';
import { SelectionGizmo } from './gizmos/selection-gizmo';
import { DraggingHandler } from './handlers/dragging-handler';
import { MoveHandler } from './handlers/move.handler';
import { RotationHandler } from './handlers/rotation-handler';
import { ScaleHandler } from './handlers/scale.handler';
import { SelectionHandler } from './handlers/selection.handler';
import { Selection } from './selection';
import './selection-area.scss';
import { SelectionUtil } from './selection.util';

export class SelectionArea extends HTMLElement {
	public static readonly tagName = 'phred-selection-area';

	private game: Phaser.Game;
	private gizmo: SelectionGizmo;
	private interval: any;

	private selection: Selection;
	private selectionHandler: SelectionHandler;

	private handlers: { [id: number]: DraggingHandler } = {};

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
		this.interval = setInterval(this.update.bind(this), 1000 / this.game.time.fps);
	}

	public disable() {
		clearInterval(this.interval);
	}

	private createHandlers(selection: Selection) {
		this.selectionHandler = new SelectionHandler(selection);
		this.handlers = {
			[GIZMO_MOVE]: new MoveHandler(),
			[GIZMO_SCALE]: new ScaleHandler(),
			[GIZMO_ROTATION]: new RotationHandler(),
		};

		// this.moveHandler = new MoveHandler();
		// this.scaleHandler = new ScaleHandler();
		// this.rotationHandler = new RotationHandler();
	}

	private createViews(selection: Selection) {
		this.gizmo = document.createElement(SelectionGizmo.tagName) as SelectionGizmo;
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
	private _handler: DraggingHandler;

	private onMouseDown(e: MouseEvent) {
		if (e.button !== 0) return;
		this._mouseIsDown = true;
		this._isDragging = false;
		this._hasSelection = this.gizmo.isOver;
		this._handler = this.handlers[(e.target as Gizmo).type];
	}

	private onMouseUp(e: MouseEvent) {
		if (e.button !== 0) return;
		this._mouseIsDown = false;
		this._handler?.stopHandling(e);
		this._handler = null;
		this.gizmo.stopMoving();
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
			if (this._hasSelection) {
				this._handler.startHandling(e, this.selection.object);
				this.gizmo.startMoving();
				return;
			}
		}
		this._handler.handle(e);
	}

	// #endregion
}

customElements.define(SelectionArea.tagName, SelectionArea);
