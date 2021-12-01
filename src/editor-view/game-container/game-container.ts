import { ComponentTags } from 'component-tags';
import { ActionHandler } from 'core/action-handler';
import { Actions } from 'core/actions';
import { SelectionArea } from 'editor-view/selectors/selection-area';
import './game-container.scss';

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;

export class GameContainer extends HTMLElement {
	private gameOriginalParentElement: HTMLElement;
	private gameEditorParentElement: HTMLElement;
	private selectionArea: SelectionArea;
	private game: Phaser.Game;

	private _zoom = 1;

	public init() {
		this._onInputUpFn = this.onInputUp.bind(this);
		const el = this.gameEditorParentElement = document.createElement('div');
		el.id = 'phred-game-parent';
		this.appendChild(el);
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

		this.onmousedown = this.onInputDown;
		this.onmousemove = this.onInputMove;
		this.onmouseup = this.onInputUp;
	}

	public addGame(game: Phaser.Game) {
		this.game = game;
		const el = game.canvas.parentElement;
		this.gameOriginalParentElement = el.parentElement;
		el.classList.add('phred-game');
		this.gameEditorParentElement.appendChild(el);

		this.selectionArea = this.gameEditorParentElement.appendChild(document.createElement('phred-selection-area')) as SelectionArea;
		this.selectionArea.game = this.game;
	}

	public returnGameToItsParent() {
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
		this.selectionArea.zoom = this._zoom;
		// this.game.scale.refresh();
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
