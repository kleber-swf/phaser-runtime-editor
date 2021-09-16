import { PanelSide } from '../panel-side';
import './resize-handle.scss';

export class ResizeHandle extends HTMLElement {
	public static readonly tagName: string = 'phred-resize-handle';
	private panel: HTMLElement;

	public init(panel: HTMLElement, side: PanelSide) {
		const line = document.createElement('div');
		line.classList.add('line');
		this.appendChild(line);

		this.panel = panel;
		this.classList.add(side);
		this._resize = side === 'right'
			? this.resizeRight.bind(this)
			: this.resizeLeft.bind(this);

		this._stopResize = this.stopResizing.bind(this);
		this.onmousedown = this.startResizing.bind(this);
	}

	private _resize: () => void;
	private _stopResize: () => void;

	private startResizing(e: MouseEvent) {
		e.stopImmediatePropagation();
		e.preventDefault();
		window.addEventListener('mousemove', this._resize);
		window.addEventListener('mouseup', this._stopResize);
	}

	private resizeLeft(e: MouseEvent) {
		e.stopImmediatePropagation();
		e.preventDefault();
		this.panel.style.width = (e.clientX - this.panel.offsetLeft) + 'px';
	}

	private resizeRight(e: MouseEvent) {
		e.stopImmediatePropagation();
		e.preventDefault();
		this.panel.style.width = (this.panel.offsetWidth - (e.clientX - this.panel.offsetLeft)) + 'px';
	}

	private stopResizing(e: MouseEvent) {
		e.stopImmediatePropagation();
		e.preventDefault();
		window.removeEventListener('mousemove', this._resize);
		window.removeEventListener('mouseup', this._stopResize);
	}
}

customElements.define(ResizeHandle.tagName, ResizeHandle);
