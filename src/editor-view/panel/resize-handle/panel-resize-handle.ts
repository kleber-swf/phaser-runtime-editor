import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences/preferences.model';
import { PanelSide } from 'types';
import './panel-resize-handle.scss';

export class PanelResizeHandle extends HTMLElement {
	public static readonly tagName = 'phred-panel-resize-handle';

	private panel: HTMLElement;
	private side: PanelSide;

	public init(panel: HTMLElement, side: PanelSide) {
		this.side = side;
		const thumb = document.createElement('div');
		thumb.classList.add('thumb');
		this.appendChild(thumb);

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
		if (e.button !== 0) return;
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
		Editor.prefs.set((this.side + 'PanelSize') as PreferenceKey, this.panel.style.width);
	}
}

customElements.define(PanelResizeHandle.tagName, PanelResizeHandle);
