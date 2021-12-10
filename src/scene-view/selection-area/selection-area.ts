import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences';
import { PluginConfig } from 'plugin.model';
import { Gizmo, GIZMO_MOVE, GIZMO_SCALE } from './gizmos/gizmo';
import { SelectionGizmo } from './gizmos/selection-gizmo';
import { DraggingHandler } from './handlers/dragging-handler';
import { MoveHandler } from './handlers/move.handler';
import { ScaleHandler } from './handlers/scale.handler';
import { SelectionHandler } from './handlers/selection.handler';
import { HitAreaSnapshot } from './hit-area-snapshot/hit-area-snapshot';
import './selection-area.scss';
import { SelectionUtil } from './selection.util';

export class SelectionArea extends HTMLElement {
	public static readonly tagName = 'phred-selection-area';

	private gizmo: SelectionGizmo;

	private handlers: { [id: number]: DraggingHandler } = {};
	private selectionHandler: SelectionHandler;
	private hitAreaSnapshot: HitAreaSnapshot;

	private _enabled: boolean;
	private updateBind: () => void;

	// #region Initialization

	public init(game: Phaser.Game) {
		SelectionUtil.init(game, this);
		this.updateBind = this.update.bind(this);

		this.createHandlers();
		this.createGizmos();
		this.createHitAreaSnapshot(game);

		this.addEventListener('mousedown', this.onMouseDown.bind(this));
		this.addEventListener('mouseup', this.onMouseUp.bind(this));
		this.addEventListener('mousemove', this.onMouseMove.bind(this));

		Editor.data.onSelectedObjectChanged.add(this.onSelectedObjectChanged, this);

		const prefs = Editor.prefs;
		prefs.onPreferenceChanged.add(this.onPreferencesChanged, this);
		this.onPreferencesChanged('gizmos', prefs.get('gizmos'));
		this.onPreferencesChanged('snap', prefs.get('snap'));
		this.onPreferencesChanged('guides', prefs.get('guides'));
		this.onPreferencesChanged('hitArea', prefs.get('hitArea'));
	}

	public enable(config: PluginConfig) {
		this.selectionHandler.enable(config.root);
		this.hitAreaSnapshot.enable(config.root);
		this._enabled = true;
		window.requestAnimationFrame(this.updateBind);
	}

	public disable() { this._enabled = false; }

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

	private createHitAreaSnapshot(game: Phaser.Game) {
		this.hitAreaSnapshot = document.createElement(HitAreaSnapshot.tagName) as HitAreaSnapshot;
		this.appendChild(this.hitAreaSnapshot);
		this.hitAreaSnapshot.init(game);
	}

	// #endregion

	private update() {
		this.gizmo.redraw();
		if (this._enabled) {
			window.requestAnimationFrame(this.updateBind);
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
				return;
			case 'allHitAreasSnapshot':
				if (value === true) this.hitAreaSnapshot.show();
				else this.hitAreaSnapshot.hide();
		}
	}

	private onSelectedObjectChanged(selection: PIXI.DisplayObject) {
		if (!selection) this.selectionHandler.clearSelectionTree();
	}

	// #endregion
}

customElements.define(SelectionArea.tagName, SelectionArea);
