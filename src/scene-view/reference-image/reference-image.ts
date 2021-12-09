import { PluginConfig } from 'plugin.model';
import './reference-image.scss';

export class ReferenceImage extends HTMLElement {
	public static readonly tagName = 'phred-reference-image';

	public set source(value: string) {
		this.style.backgroundImage = `url('${value}')`;
	}

	public set alpha(value: number) {
		this.style.opacity = value.toString();
	}

	public set saturation(value: number) {
		value = Math.max(0, Math.min(1, value));
		this.style.filter = `saturate(${value})`;
	}

	public init() {
	}

	public enable(config: PluginConfig) {
		this.source = './assets/reference.jpg';
		this.alpha = 0.5;
		// this.saturation = 0;
		this.style.filter = 'hue-rotate(206.74698795180723deg)';
	}
}

customElements.define(ReferenceImage.tagName, ReferenceImage);
