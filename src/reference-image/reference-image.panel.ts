import { PopupContainer } from 'editor-view/popup/popup-container';
import './reference-image.panel.scss';

export class ReferenceImagePanel extends PopupContainer {
	public static readonly tagName = 'phred-reference-image-panel';

	public connectedCallback() {
		this.classList.add('popup-container');
	}

	public openPopup(opener: HTMLElement) {
		super.openPopup();
	}
}

customElements.define(ReferenceImagePanel.tagName, ReferenceImagePanel);
