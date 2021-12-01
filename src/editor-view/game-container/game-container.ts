import { ComponentTags } from 'component-tags';
import { ActionHandler } from 'core/action-handler';
import { Actions } from 'core/actions';
import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences';
import { SelectionArea } from 'editor-view/selectors/selection-area';
import { PluginConfig } from 'plugin.model';
import './game-container.scss';

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;

export class GameContainer extends HTMLElement {
	private gameOriginalParentElement: HTMLElement;
	private gameEditorParentElement: HTMLElement;
	private selectionArea: SelectionArea;
	private game: Phaser.Game;

	private _zoom = 1;

	public init(game: Phaser.Game, config: PluginConfig) {
		this.game = game;
		this._onInputUpFn = this.onInputUp.bind(this);
		const gp = this.gameEditorParentElement = document.createElement('div');
		gp.id = 'phred-game-parent';
		this.appendChild(gp);

		const sa = document.createElement('phred-selection-area') as SelectionArea;
		this.selectionArea = this.gameEditorParentElement.appendChild(sa);
		sa.id = 'selection-area';
		sa.init(game, config);
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

	private onPreferencesChanged(key: PreferenceKey, value: boolean) {
		if (key === 'responsive') this.setResponsive(value);
	}

	public enable() {
		const el = this.game.canvas.parentElement;
		this.gameOriginalParentElement = el.parentElement;
		el.classList.add('phred-game');
		this.gameEditorParentElement.appendChild(el);
	}

	// returns the game to its original parent
	public disable() {
		const el = this.game.canvas.parentElement;
		el.classList.remove('phred-game');
		this.gameOriginalParentElement.appendChild(el);
		this.gameOriginalParentElement = null;
		this.game = null;
	}

	private zoom(amount: number, ox = 0, oy = 0) {
		const el = this.gameEditorParentElement;
		this._zoom = Phaser.Math.clamp(this._zoom + amount * 0.001, MIN_SCALE, MAX_SCALE);
		el.style.transform = `scale(${this._zoom * 100}%)`;
		el.style.transformOrigin = `${ox}px ${oy}px`;
		// this.game.scale.refresh();
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
