import { Editor } from 'core/editor';
import { Popup } from './popup';
import './popup-container.scss';

export class PopupContainer extends HTMLElement {
	protected popup: Popup;

	public connectedCallback() {
		this.classList.add('popup-container');
	}

	public openPopup(title: string, ..._args: any[]) {
		this.createPopup(title);
		Editor.editorView.appendChild(this);
	}

	protected createPopup(title: string) {
		this.popup = this.appendChild(document.createElement(Popup.tagName)) as Popup;
		this.popup.addEventListener('click', e => e.stopPropagation());
		this.popup.init(title);
		this.addEventListener('click', () => this.remove());
		return this.popup;
	}
}
