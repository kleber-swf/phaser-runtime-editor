import { ActionHandler } from 'core/action-handler';
import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences';
import { PluginConfig } from 'plugin.model';
import { GameParent } from 'scene-view/game-parent/game-parent';
import { ReferenceImage } from 'scene-view/reference-image/reference-image';
import { SelectionArea } from 'scene-view/selection-area/selection-area';
import './game-container.scss';
import { GameResizeHandle } from './game-resize-handle';

export class GameContainer extends HTMLElement {
	public static readonly tagName = 'phred-game-container';

	private game: Phaser.Game;
	private gameOriginalParentElement: HTMLElement;

	private gameParent: GameParent;
	private selectionArea: SelectionArea;
	private referenceImage: ReferenceImage;

	public init(game: Phaser.Game) {
		this.game = game;
		this._onInputUpFn = this.onInputUp.bind(this);
		const parent = this.gameParent = document.createElement(GameParent.tagName) as GameParent;
		parent.init();
		this.appendChild(parent);

		const selectionArea = document.createElement(SelectionArea.tagName) as SelectionArea;
		this.selectionArea = parent.appendChild(selectionArea);
		selectionArea.init(game);

		this.createResizeHandles(parent);
	}

	public setupActions(actions: ActionHandler) {
		this.gameParent.setupActions(actions);

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
		this.gameParent.appendChild(el);
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

	private setResponsive(responsive: boolean) {
		if (responsive) {
			if (!this.classList.contains('responsive')) {
				this.classList.add('responsive');
			}
			this.gameParent.setResponsiveSize(Editor.prefs.responsiveSize);
		} else {
			this.classList.remove('responsive');
			this.gameParent.clearResponsiveSize();
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
				this.gameParent.setResponsiveSize(value);
				break;
			case 'responsiveSizeTemplateIndex':
				this.gameParent.responsiveSizeTemplateChanged(value);
				break;
		}
	}

	private onGameResized(width: number, height: number) {
		Editor.prefs.responsiveSize = { width, height };
	}

	// #endregion
}

customElements.define(GameContainer.tagName, GameContainer);
