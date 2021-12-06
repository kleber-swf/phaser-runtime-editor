import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences';
import { PluginConfig } from 'plugin.model';
import { Gizmo, GIZMO_MOVE, GIZMO_SCALE } from './gizmos/gizmo';
import { SelectionGizmo } from './gizmos/selection-gizmo';
import { DraggingHandler } from './handlers/dragging-handler';
import { MoveHandler } from './handlers/move.handler';
import { ScaleHandler } from './handlers/scale.handler';
import { SelectionHandler } from './handlers/selection.handler';
import './selection-area.scss';
import { SelectionUtil } from './selection.util';

export class SelectionArea extends HTMLElement {
	public static readonly tagName = 'phred-selection-area';

	private gizmo: SelectionGizmo;
	private interval: any;

	private selectionHandler: SelectionHandler;

	private handlers: { [id: number]: DraggingHandler } = {};

	// #region Initialization

	public init(game: Phaser.Game) {
		SelectionUtil.init(game, this);

		this.createHandlers();
		this.createGizmos();

		this.addEventListener('mousedown', this.onMouseDown.bind(this));
		this.addEventListener('mouseup', this.onMouseUp.bind(this));
		this.addEventListener('mousemove', this.onMouseMove.bind(this));

		const prefs = Editor.prefs;
		prefs.onPreferenceChanged.add(this.onPreferencesChanged, this);
		this.onPreferencesChanged('gizmos', prefs.gizmos);
		this.onPreferencesChanged('snap', prefs.snap);
		this.onPreferencesChanged('guides', prefs.guides);
		this.onPreferencesChanged('hitArea', prefs.hitArea);
	}

	public enable(config: PluginConfig) {
		this.selectionHandler.enable(config.root);
		this.interval = setInterval(this.update.bind(this), 1000 / 30);
	}

	public disable() {
		clearInterval(this.interval);
	}

	private createHandlers() {
		this.selectionHandler = new SelectionHandler();
		this.handlers = {
			[GIZMO_MOVE]: new MoveHandler(),
			[GIZMO_SCALE]: new ScaleHandler(),
			// [GIZMO_ROTATION]: new RotationHandler(),
		};
	}

	private createGizmos() {
		this.gizmo = document.createElement(SelectionGizmo.tagName) as SelectionGizmo;
		this.appendChild(this.gizmo);
		this.gizmo.init();
	}

	// #endregion

	private update() {
		this.gizmo.redraw();
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
				if (this._hasSelection && !this._handler) {
					this._handler = this.handlers[GIZMO_MOVE];
				}
			}
			if (this._hasSelection) {
				this._handler.startHandling(e, Editor.data.selectedObject);
				this.gizmo.startMoving();
				return;
			}
		}

		if (this._handler) {
			this._handler.handle(e);
		}
	}

	private onPreferencesChanged(key: PreferenceKey, value: any) {
		switch (key) {
			case 'gizmos':
				this.gizmo.visible = value;
				return;
			case 'snap':
				(this.handlers[GIZMO_MOVE] as MoveHandler)
					.snap(Editor.data.selectedObject, value);
				return;
			case 'guides':
				this.gizmo.showGuides = value === true;
				return;
			case 'hitArea':
				this.gizmo.showHitArea = value === true;
		}
	}

	// #endregion
}

customElements.define(SelectionArea.tagName, SelectionArea);
