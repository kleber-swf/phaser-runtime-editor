import { PopupContainer } from 'editor-view/popup/popup-container';
import './reference-image.panel.scss';

export class ReferenceImagePanel extends PopupContainer {
	public static readonly tagName = 'phred-reference-image-panel';

	public connectedCallback() {
		this.classList.add('popup-container');
	}

	public openPopup(title: string, opener: HTMLElement) {
		super.openPopup(title);
		const b = opener.getBoundingClientRect();
		this.popup.style.top = `${b.bottom}px`;
		this.popup.style.left = `${b.right}px`;
	}

	protected createPopup(title: string) {
		const popup = super.createPopup(title);

		const content = popup.content;
		content.appendChild(this.createOption('Alpha', this.createSlider(0, 1, 0.05, 1)));
		content.appendChild(this.createOption('Hue', this.createSlider(0, 360, 0.05, 1)));
		content.appendChild(this.createOption('Saturation', this.createSlider(0, 1, 0.05, 1)));

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

	private createSlider(min: number, max: number, step: number, value: number) {
		const slider = document.createElement('input');
		slider.type = 'range';
		slider.min = min.toString();
		slider.max = max.toString();
		slider.step = step.toString();
		slider.value = value.toString();
		// slider.oninput = () => image.alpha = parseFloat(slider.value);
		// slider.value = image.alpha.toString();
		return slider;
	}
}

customElements.define(ReferenceImagePanel.tagName, ReferenceImagePanel);
