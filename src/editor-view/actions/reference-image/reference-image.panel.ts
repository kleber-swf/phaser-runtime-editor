import { PopupContainer } from 'editor-view/popup/popup-container';
import { ReferenceImage } from 'scene-view/reference-image/reference-image';
import './reference-image.panel.scss';

export class ReferenceImagePanel extends PopupContainer {
	public static readonly tagName = 'phred-reference-image-panel';

	private image: ReferenceImage;

	public connectedCallback() {
		this.classList.add('popup-container');
	}

	public openPopup(title: string, opener: HTMLElement, image: ReferenceImage) {
		super.openPopup(title);
		this.image = image;
		const b = opener.getBoundingClientRect();
		this.popup.style.top = `${b.bottom}px`;
		this.popup.style.left = `${b.right}px`;
	}

	protected createPopup(title: string) {
		const popup = super.createPopup(title);

		// TODO load prefs

		const content = popup.content;
		content.appendChild(this.createOption('Alpha', this.createSlider('opacity', 0, 1, 1)));
		content.appendChild(this.createOption('Hue', this.createSlider('hue', 0, 360, 1)));
		content.appendChild(this.createOption('Saturation', this.createSlider('saturation', 0, 1, 1)));

		return popup;
	}

	private createOption(title: string, content: HTMLElement) {
		const option = document.createElement('div');
		option.classList.add('option');

		const label = option.appendChild(document.createElement('label'));
		label.classList.add('title');
		label.innerText = title;

		option.appendChild(content);

		return option;
	}

	private createSlider(property: 'opacity' | 'hue' | 'saturation', min: number, max: number, value: number) {
		const slider = document.createElement('input');
		slider.type = 'range';
		slider.min = min.toString();
		slider.max = max.toString();
		slider.step = '0.05';
		slider.value = value.toString();
		slider.oninput = () => this.image.setProperty(property, parseFloat(slider.value));
		// slider.oninput = () => image.alpha = parseFloat(slider.value);
		// slider.value = image.alpha.toString();
		return slider;
	}

	public close(): void {
		// TODO save preferences
		super.close();
	}
}

customElements.define(ReferenceImagePanel.tagName, ReferenceImagePanel);
