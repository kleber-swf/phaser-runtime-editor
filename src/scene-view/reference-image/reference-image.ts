import './reference-image.scss';

export class ReferenceImage extends HTMLElement {
	private image: HTMLImageElement;

	public set source(value: string) {
		this.image.src = value;
	}

	public set alpha(value: number) {
		this.style.opacity = value.toString();
	}

	public set saturation(value: number) {
		value = Math.max(0, Math.min(1, value));
		this.style.filter = `saturate(${value})`;
	}

	public init() {
		this.image = this.appendChild(document.createElement('img')) as HTMLImageElement;
	}
}
