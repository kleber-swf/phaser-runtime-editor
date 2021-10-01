import { ComponentTags } from 'component-tags';
import { ActionHandler } from 'core/action-handler';
import { Actions } from 'core/actions';
import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences';
import './game-container.scss';

const MIN_WIDTH = 100;
const MAX_WIDTH = 10000;

export class GameContainer extends HTMLElement {
	private gameOriginalParentElement: HTMLElement;
	private gameEditorParentElement: HTMLElement;
	private game: Phaser.Game;

	public init() {
		this._onInputUpFn = this.onInputUp.bind(this);
		const el = this.gameEditorParentElement = document.createElement('div');
		el.id = 'phred-game-parent';
		this.appendChild(el);
	}

	public setupActions(actions: ActionHandler) {
		actions.setActionCommand(Actions.ZOOM, (e) => this.zoom(-(e as WheelEvent).deltaY));
		actions.setActionCommand(Actions.ZOOM_IN, () => this.zoom(100));
		actions.setActionCommand(Actions.ZOOM_OUT, () => this.zoom(-100));
		
		Editor.prefs.onPreferenceChanged.add(this.onPreferencesChanged, this);
		this.onPreferencesChanged('responsive', Editor.prefs.responsive);

		this.onmousedown = this.onInputDown;
		this.onmousemove = this.onInputMove;
		this.onmouseup = this.onInputUp;
	}

	private onPreferencesChanged(key: PreferenceKey, value: boolean) {
		if (key === 'responsive') this.setResponsive(value);
	}

	public addGame(game: Phaser.Game) {
		this.game = game;
		const el = game.canvas.parentElement;
		this.gameOriginalParentElement = el.parentElement;
		el.classList.add('phred-game');
		this.gameEditorParentElement.appendChild(el);
	}

	public returnGameToItsParent() {
		const el = this.game.canvas.parentElement;
		el.classList.remove('phred-game');
		this.gameOriginalParentElement.appendChild(el);
		this.gameOriginalParentElement = null;
		this.game = null;
	}

	private zoom(amount: number) {
		const el = this.gameEditorParentElement;
		const ratio = el.clientHeight / el.clientWidth;
		const width = Math.max(Math.min(el.clientWidth + amount, MAX_WIDTH), MIN_WIDTH);
		const height = width * ratio;
		el.style.width = width + 'px';
		el.style.height = height + 'px';
		this.game.scale.refresh();
	}

	private setResponsive(responsive: boolean) {
		const style = this.gameEditorParentElement.style;
		if (responsive) {
			style.width = '100%';
			style.height = '100%';
		} else {
			style.width = 'unset';
			style.height = 'unset';
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
		this.scrollTop = this._downPageY - e.pageY
	}

	private onInputUp() {
		this.onmousemove = null;
		document.removeEventListener('mouseup', this._onInputUpFn);
	}

	// #endregion
}

customElements.define(ComponentTags.GameContainer, GameContainer);
