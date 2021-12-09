import { PopupContainer } from 'editor-view/popup/popup-container';
import './reference-image.panel.scss';

export class ReferenceImagePanel extends PopupContainer {
	public static readonly tagName = 'phred-reference-image-panel';

	public connectedCallback() {
		this.classList.add('popup-container');
	}

	public openPopup(title:string, opener: HTMLElement) {
		super.openPopup(title);
		const b = opener.getBoundingClientRect();
		this.popup.style.top = `${b.bottom}px`;
		this.popup.style.left = `${b.right}px`;
	}

	// protected createPopup() {
	// 	const popup = super.createPopup();
	// 	popup.appendChild(document.createElement('h1')).innerHTML = 'Reference image';

	// 	// const content = popup.content;
	// 	// content.appendChild(this.createLine('Alpha', this.createAlphaSlider()));

	// 	return popup;
	// }

	private createLine(title: string, content: HTMLElement) {

	}

	private createAlphaSlider() {
		const slider = document.createElement('input');
		slider.type = 'range';
		slider.min = '0';
		slider.max = '1';
		slider.step = '0.05';
		// slider.oninput = () => image.alpha = parseFloat(slider.value);
		// slider.value = image.alpha.toString();
		return slider;
	}
}

customElements.define(ReferenceImagePanel.tagName, ReferenceImagePanel);
