import './reference-image.scss';

export interface ReferenceImageFilters {
	opacity: number;
	hue: number;
	saturation: number;
	contrast: number;
	brightness: number;
	sepia: number;
}

export type RefImageFilterTypes = keyof ReferenceImageFilters;

export class ReferenceImage extends HTMLElement implements ReferenceImageFilters {
	public static readonly tagName = 'phred-reference-image';
	private image: HTMLImageElement;
	private _src: string;

	private filters: ReferenceImageFilters = {
		opacity: 1,
		hue: 0,
		saturation: 1,
		contrast: 1,
		brightness: 1,
		sepia: 0,
	};

	public set source(value: string) {
		if (this._src === value) return;
		this._src = value;
		this.image.src = value ?? '';
		this.classList.addOrRemove('invisible', !value);
		if (!value) this.dispatchEvent(new CustomEvent('imageLoaded', { detail: false }));
	}

	public set opacity(value: number) {
		this.filters.opacity = Phaser.Math.clamp(value, 0, 1);
		this.applyFilters();
	}

	public set hue(value: number) {
		this.filters.hue = Phaser.Math.clamp(value, 0, 1);
		this.applyFilters();
	}

	public set saturation(value: number) {
		this.filters.saturation = Phaser.Math.clamp(value, 0, 1);
		this.applyFilters();
	}

	public set contrast(value: number) {
		this.filters.contrast = Phaser.Math.clamp(value, 0, 1);
		this.applyFilters();
	}

	public set brightness(value: number) {
		this.filters.brightness = Phaser.Math.clamp(value, 0, 1);
		this.applyFilters();
	}

	public set sepia(value: number) {
		this.filters.sepia = Phaser.Math.clamp(value, 0, 1);
		this.applyFilters();
	}

	public init() {
		this.image = this.appendChild(document.createElement('img'));
		this.image.addEventListener('load', this.onImageLoadComplete.bind(this));
		this.image.addEventListener('error', this.onImageLoadError.bind(this));
	}

	public enable(filters: ReferenceImageFilters) {
		this.filters = Object.assign(this.filters, filters);
		this.applyFilters();
	}

	public getFilters() { return this.filters; }

	public setProperty(prop: RefImageFilterTypes, value: number) { this[prop] = value; }

	private applyFilters() {
		const f = this.filters;
		const filter = `opacity(${f.opacity})`
			+ ` hue-rotate(${f.hue * 360}deg)`
			+ ` saturate(${f.saturation})`
			+ ` contrast(${f.contrast * 100}%)`
			+ ` brightness(${f.brightness * 100}%)`
			+ ` sepia(${f.sepia})`;
		this.image.style.filter = filter;
	}

	private onImageLoadComplete() {
		this.classList.remove('invisible');
		this.dispatchEvent(new CustomEvent('imageLoaded', { detail: true }));
	}

	private onImageLoadError() {
		this.classList.add('invisible');
		this.dispatchEvent(new CustomEvent('imageLoaded', { detail: false }));
	}
}

customElements.define(ReferenceImage.tagName, ReferenceImage);
