import { ActionHandler } from 'core/action-handler';
import { Actions } from 'core/actions';
import { Size } from 'plugin.model';
import './game-parent.scss';

const MIN_WIDTH = 100;
const MAX_WIDTH = 10000;

export class GameParent extends HTMLElement {
	public static readonly tagName = 'phred-game-parent';

	private _zoomAmount = 0;

	public init() {
		this.id = GameParent.tagName;
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
	}

	public zoom(amount: number) {
		const width = Math.max(Math.min(this.clientWidth + amount, MAX_WIDTH), MIN_WIDTH);
		const height = width * (this.clientHeight / this.clientWidth);
		this._zoomAmount += width - this.clientWidth;
		this.style.width = width + 'px';
		this.style.height = height + 'px';
	}

	private resetZoom() {
		const w = this.clientWidth - this._zoomAmount;
		const ratio = w / this.clientWidth;
		this._zoomAmount = 0;

		this.style.width = w + 'px';
		this.style.height = (this.clientHeight * ratio) + 'px';
	}

	public setResponsiveSize(size: Size) {
		this.style.width = size.width + 'px';
		this.style.height = size.height + 'px';
	}

	public clearResponsiveSize() {
		this.style.width = 'unset';
		this.style.height = 'unset';
	}

	public responsiveSizeTemplateChanged(index: number) {
		if (!index) {
			this.classList.add('resizable');
		} else {
			this.classList.remove('resizable');
		}
	}
}

customElements.define(GameParent.tagName, GameParent);
