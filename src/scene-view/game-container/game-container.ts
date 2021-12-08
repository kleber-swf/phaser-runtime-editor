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

	private gameOriginalParentElement: HTMLElement;
	private gameEditorParentElement: HTMLElement;
	private selectionArea: SelectionArea;
	private game: Phaser.Game;

	public init(game: Phaser.Game) {
		this.game = game;
		this._onInputUpFn = this.onInputUp.bind(this);
		const gp = this.gameEditorParentElement = document.createElement('div');
		gp.id = 'phred-game-parent';
		this.appendChild(gp);

		const sa = document.createElement(SelectionArea.tagName) as SelectionArea;
		this.selectionArea = this.gameEditorParentElement.appendChild(sa);

		const handleRight = document.createElement(GameResizeHandle.tagName) as GameResizeHandle;
		handleRight.init(gp, 'right');
		gp.appendChild(handleRight);

		const handleBottom = document.createElement(GameResizeHandle.tagName) as GameResizeHandle;
		handleBottom.init(gp, 'bottom');
		gp.appendChild(handleBottom);

		const handleBoth = document.createElement(GameResizeHandle.tagName) as GameResizeHandle;
		handleBoth.init(gp, 'both');
		gp.appendChild(handleBoth);

		sa.init(game);
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

		Editor.prefs.onPreferenceChanged.add(this.onPreferencesChanged, this);
		this.onPreferencesChanged('responsive', Editor.prefs.responsive);

		this.onmousedown = this.onInputDown;
		this.onmousemove = this.onInputMove;
		this.onmouseup = this.onInputUp;
	}

	private onPreferencesChanged(key: PreferenceKey, value: any) {
		if (key === 'responsive') this.setResponsive(value === true);
		if (key === 'responsiveSize') this.setResponsiveSize(value);
	}

	public enable(config: PluginConfig) {
		const el = this.game.canvas.parentElement;
		this.gameOriginalParentElement = el.parentElement;
		el.classList.add('phred-game');
		this.gameEditorParentElement.appendChild(el);
		this.selectionArea.enable(config);
	}

	// returns the game to its original parent
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
		el.style.width = width + 'px';
		el.style.height = height + 'px';
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
}

customElements.define(GameContainer.tagName, GameContainer);
