import { ActionHandler } from 'core/action-handler';
import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences/preferences.model';
import { PreferencesUtil } from 'core/preferences/preferences.util';
import { PluginConfig, Size } from 'plugin.model';
import { GameParent } from 'scene-view/game-parent/game-parent';
import { SelectionArea } from 'scene-view/selection-area/selection-area';
import './game-container.scss';

export class GameContainer extends HTMLElement {
	public static readonly tagName = 'phred-game-container';

	private game: Phaser.Game;
	private gameOriginalParentElement: HTMLElement;

	private gameParent: GameParent;
	private selectionArea: SelectionArea;

	public init(game: Phaser.Game) {
		this.game = game;
		this._onInputUpFn = this.onInputUp.bind(this);
		const parent = this.gameParent = document.createElement(GameParent.tagName) as GameParent;
		parent.init();
		this.appendChild(parent);

		const selectionArea = document.createElement(SelectionArea.tagName) as SelectionArea;
		this.selectionArea = parent.appendChild(selectionArea);
		selectionArea.init(game);
	}

	public setupActions(actions: ActionHandler) {
		this.gameParent.setupActions(actions);
		this.selectionArea.setupActions(actions);
		PreferencesUtil.setupPreferences(['responsive', 'responsiveTemplateIndex'], this.onPreferencesChanged, this);
		this.onmousedown = this.onInputDown;
		this.onmousemove = this.onInputMove;
		this.onmouseup = this.onInputUp;
	}

	public enable(config: PluginConfig) {
		const gameElement = this.game.canvas.parentElement;
		this.gameOriginalParentElement = gameElement.parentElement;
		gameElement.classList.add('phred-game');
		this.gameParent.enable(gameElement);
		this.selectionArea.enable(config);
	}

	/** Returns the game to its original parent */
	public disable() {
		this.selectionArea.disable();
		this.gameParent.disable();
		const gameElement = this.game.canvas.parentElement;
		gameElement.classList.remove('phred-game');
		this.gameOriginalParentElement.appendChild(gameElement);
		this.gameOriginalParentElement = null;
	}

	private setResponsive(responsive: boolean) {
		if (responsive) {
			this.classList.add('responsive');
			this.gameParent.setResponsiveSize(Editor.prefs.get('responsiveSize') as Size);
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
			case 'responsiveTemplateIndex':
				this.gameParent.responsiveSizeTemplateChanged(value);
				break;
		}
	}

	// #endregion
}

customElements.define(GameContainer.tagName, GameContainer);
