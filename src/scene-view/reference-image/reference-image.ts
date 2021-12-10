import { PluginConfig } from 'plugin.model';
import './reference-image.scss';

export class ReferenceImage extends HTMLElement {
	public static readonly tagName = 'phred-reference-image';
	private image: HTMLImageElement;
	private filters = { opacity: 1, hue: 0, saturation: 1 };

	public set source(value: string) { this.image.src = value; }

	public set opacity(value: number) {
		this.filters.opacity = Phaser.Math.clamp(value, 0, 1);
		this.updateFilters();
	}

	public set hue(value: number) {
		this.filters.hue = Phaser.Math.clamp(value, 0, 360);
		this.updateFilters();
	}

	public set saturation(value: number) {
		this.filters.saturation = Phaser.Math.clamp(value, 0, 1);
		this.updateFilters();
	}

	private updateFilters() {
		const f = this.filters;
		this.image.style.filter = `opacity(${f.opacity}) hue-rotate(${f.hue}deg) saturate(${f.saturation})`;
	}

	public setProperty(prop: 'opacity' | 'hue' | 'saturation', value: number) {
		this[prop] = value;
	}

	public init() {
		this.image = this.appendChild(document.createElement('img'));
	}

	public enable(config: PluginConfig) {
		this.source = config.referenceImageUrl;
	}
}

customElements.define(ReferenceImage.tagName, ReferenceImage);
