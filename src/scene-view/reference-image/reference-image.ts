import { PluginConfig } from 'plugin.model';
import './reference-image.scss';

export interface ReferenceImageFilters {
	opacity: number;
	hue: number;
	saturation: number;
}

export type RefImageFilterTypes = keyof ReferenceImageFilters;

export class ReferenceImage extends HTMLElement implements ReferenceImageFilters {
	public static readonly tagName = 'phred-reference-image';
	private image: HTMLImageElement;
	private filters = { opacity: 1, hue: 0, saturation: 1 };

	private set source(value: string) { this.image.src = value; }

	public set opacity(value: number) {
		this.filters.opacity = Phaser.Math.clamp(value, 0, 1);
		this.applyFilters();
	}

	public set hue(value: number) {
		this.filters.hue = Phaser.Math.clamp(value, 0, 360);
		this.applyFilters();
	}

	public set saturation(value: number) {
		this.filters.saturation = Phaser.Math.clamp(value, 0, 1);
		this.applyFilters();
	}

	public init() {
		this.image = this.appendChild(document.createElement('img'));
	}

	public enable(config: PluginConfig, filters: ReferenceImageFilters) {
		this.source = config.referenceImageUrl;
		this.filters = filters;
		this.applyFilters();
	}

	public getFilters() { return this.filters; }

	public setProperty(prop: RefImageFilterTypes, value: number) { this[prop] = value; }

	private applyFilters() {
		const f = this.filters;
		this.image.style.filter = `opacity(${f.opacity}) hue-rotate(${f.hue}deg) saturate(${f.saturation})`;
	}
}

customElements.define(ReferenceImage.tagName, ReferenceImage);
