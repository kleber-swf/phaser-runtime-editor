import { ActionHandler } from 'core/action-handler';
import { Actions } from 'core/actions';
import { Editor } from 'core/editor';
import { PluginConfig, Size } from 'plugin.model';
import { ReferenceImage } from 'scene-view/reference-image/reference-image';
import { GameResizeHandle } from './game-resize-handle';

const MIN_WIDTH = 100;
const MAX_WIDTH = 10000;

export class GameParent extends HTMLElement {
	public static readonly tagName = 'phred-game-parent';
	private referenceImage: ReferenceImage;
	private _zoomAmount = 0;

	public init() {
		this.id = GameParent.tagName;
		this.createResizeHandles();
		this.referenceImage = document.createElement(ReferenceImage.tagName) as ReferenceImage;
		this.referenceImage.init();
		this.appendChild(this.referenceImage);
	}

	public enable(gameElement: HTMLElement, config: PluginConfig) {
		this.appendChild(gameElement);
		this.referenceImage.enable(config);
	}

	public disable() {

	}

	private createResizeHandles() {
		const onStopDrag = this.onGameResized.bind(this);
		const handleRight = document.createElement(GameResizeHandle.tagName) as GameResizeHandle;
		handleRight.init(this, 'right');
		handleRight.onStopDrag = onStopDrag;
		this.appendChild(handleRight);

		const handleBottom = document.createElement(GameResizeHandle.tagName) as GameResizeHandle;
		handleBottom.init(this, 'bottom');
		handleBottom.onStopDrag = onStopDrag;
		this.appendChild(handleBottom);

		const handleBoth = document.createElement(GameResizeHandle.tagName) as GameResizeHandle;
		handleBoth.init(this, 'both');
		handleBoth.onStopDrag = onStopDrag;
		this.appendChild(handleBoth);
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

	private onGameResized(width: number, height: number) {
		Editor.prefs.responsiveSize = { width, height };
	}
}

customElements.define(GameParent.tagName, GameParent);
