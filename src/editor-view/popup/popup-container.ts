import { Editor } from 'core/editor';
import './popup-container.scss';

export class PopupContainer extends HTMLElement {
	protected popup: HTMLElement;

	public connectedCallback() {
		this.classList.add('popup-container');
	}

	public openPopup(..._args: any[]) {
		this.createPopup();
		Editor.editorView.appendChild(this);
	}

	protected createPopup() {
		this.popup = this.appendChild(document.createElement('div'));
		this.popup.classList.add('popup');
		return this.popup;
	}
}
