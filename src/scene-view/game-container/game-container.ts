import { ActionHandler } from 'core/action-handler';
import { Actions } from 'core/actions';
import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences';
import { PluginConfig, Size } from 'plugin.model';
import { SelectionArea } from 'scene-view/selection-area/selection-area';
import './game-container.scss';
import { GameResizeHandle } from './game-resize-handle';

const MIN_WIDTH = 100;
const MAX_WIDTH = 10000;

export class GameContainer extends HTMLElement {
	public static readonly tagName = 'phred-game-container';

	// TODO this could be a custom element
	private gameOriginalParentElement: HTMLElement;

	private gameEditorParentElement: HTMLElement;
	private selectionArea: SelectionArea;
	private game: Phaser.Game;
	private _zoomAmount = 0;

	public init(game: Phaser.Game) {
		this.game = game;
		this._onInputUpFn = this.onInputUp.bind(this);
		const gp = this.gameEditorParentElement = document.createElement('div');
		gp.id = 'phred-game-parent';
		this.appendChild(gp);

		const sa = document.createElement(SelectionArea.tagName) as SelectionArea;
		this.selectionArea = gp.appendChild(sa);
		sa.init(game);

		this.createResizeHandles(gp);
	}

	public setupActions(actions: ActionHandler) {
		actions.setActionCommand(Actions.ZOOM, (e) => {
			const w = e as WheelEvent;
			// TODO scale anchor
			// this.zoom(-w.deltaY, w.offsetX, w.offsetY);
			this.zoom(-w.deltaY);
		});

		actions.setActionCommand(Actions.ZOOM_IN, () => this.zoom(100));
		actions.setActionCommand(Actions.ZOOM_OUT, () => this.zoom(-100));
		actions.setActionCommand(Actions.ZOOM_RESET, () => this.resetZoom());

		Editor.prefs.onPreferenceChanged.add(this.onPreferencesChanged, this);
		this.onPreferencesChanged('responsive', Editor.prefs.responsive);
		this.onPreferencesChanged('responsiveSizeTemplateIndex', Editor.prefs.responsiveSizeTemplateIndex);

		this.onmousedown = this.onInputDown;
		this.onmousemove = this.onInputMove;
		this.onmouseup = this.onInputUp;
	}

	private createResizeHandles(parent: HTMLElement) {
		const onStopDrag = this.onGameResized.bind(this);
		const handleRight = document.createElement(GameResizeHandle.tagName) as GameResizeHandle;
		handleRight.init(parent, 'right');
		handleRight.onStopDrag = onStopDrag;
		parent.appendChild(handleRight);

		const handleBottom = document.createElement(GameResizeHandle.tagName) as GameResizeHandle;
		handleBottom.init(parent, 'bottom');
		handleBottom.onStopDrag = onStopDrag;
		parent.appendChild(handleBottom);

		const handleBoth = document.createElement(GameResizeHandle.tagName) as GameResizeHandle;
		handleBoth.init(parent, 'both');
		handleBoth.onStopDrag = onStopDrag;
		parent.appendChild(handleBoth);
	}

	public enable(config: PluginConfig) {
		const el = this.game.canvas.parentElement;
		this.gameOriginalParentElement = el.parentElement;
		el.classList.add('phred-game');
		this.gameEditorParentElement.appendChild(el);
		this.selectionArea.enable(config);
	}

	/** Returns the game to its original parent */
	public disable() {
		this.selectionArea.disable();
		const el = this.game.canvas.parentElement;
		el.classList.remove('phred-game');
		this.gameOriginalParentElement.appendChild(el);
		this.gameOriginalParentElement = null;
	}

	private zoom(amount: number) {
		const el = this.gameEditorParentElement;
		const width = Math.max(Math.min(el.clientWidth + amount, MAX_WIDTH), MIN_WIDTH);
		const height = width * (el.clientHeight / el.clientWidth);
		this._zoomAmount += width - el.clientWidth;
		el.style.width = width + 'px';
		el.style.height = height + 'px';
	}

	private resetZoom() {
		const el = this.gameEditorParentElement;
		const w = el.clientWidth - this._zoomAmount;
		const ratio = w / el.clientWidth;
		this._zoomAmount = 0;

		el.style.width = w + 'px';
		el.style.height = (el.clientHeight * ratio) + 'px';
	}

	private setResponsive(responsive: boolean) {
		if (responsive) {
			if (!this.classList.contains('responsive')) {
				this.classList.add('responsive');
			}
			this.setResponsiveSize(Editor.prefs.responsiveSize);
		} else {
			this.classList.remove('responsive');
			this.clearResponsiveSize();
		}
	}

	private setResponsiveSize(size: Size) {
		this.gameEditorParentElement.style.width = size.width + 'px';
		this.gameEditorParentElement.style.height = size.height + 'px';
	}

	private clearResponsiveSize() {
		this.gameEditorParentElement.style.width = 'unset';
		this.gameEditorParentElement.style.height = 'unset';
	}

	private responsiveSizeTemplateChanged(index: number) {
		if (!index) {
			this.gameEditorParentElement.classList.add('resizable');
		} else {
			this.gameEditorParentElement.classList.remove('resizable');
		}
	}

	// #region Panning

	private _downPageX = 0;
	private _downPageY = 0;
	private _onInputUpFn: () => void;

	private onInputDown(e: MouseEvent) {
		if (e.button !== 1) return;
		this.onmousemove = this.onInputMove;
		document.addEventListener('mouseup', this._onInputUpFn);
		this._downPageX = this.scrollLeft + e.pageX;
		this._downPageY = this.scrollTop + e.pageY;
	}

	private onInputMove(e: MouseEvent) {
		this.scrollLeft = this._downPageX - e.pageX;
		this.scrollTop = this._downPageY - e.pageY;
	}

	private onInputUp() {
		this.onmousemove = null;
		document.removeEventListener('mouseup', this._onInputUpFn);
	}

	// #endregion

	// #region Other Event Handling

	private onPreferencesChanged(key: PreferenceKey, value: any) {
		switch (key) {
			case 'responsive':
				this.setResponsive(value === true);
				break;
			case 'responsiveSize':
				this.setResponsiveSize(value);
				break;
			case 'responsiveSizeTemplateIndex':
				this.responsiveSizeTemplateChanged(value);
				break;
		}
	}

	private onGameResized(width: number, height: number) {
		Editor.prefs.responsiveSize = { width, height };
	}

	// #endregion
}

customElements.define(GameContainer.tagName, GameContainer);
