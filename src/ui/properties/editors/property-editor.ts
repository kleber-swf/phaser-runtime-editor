import './property-editor.scss';

export abstract class PropertyEditor<T> extends HTMLElement {
	public connectedCallback() {
		this.classList.add('property-editor');
	}

	protected createLabel(title: string, propertyId: string): HTMLElement {
		const label = document.createElement('label');
		label.classList.add('property-title');
		label.append(title);
		label.setAttribute('for', propertyId);
		return label;
	}

	protected abstract createContent(value: T, propertyId: string): HTMLElement;

	public setContent(name: string, value: T) {
		const propId = `prop-${name}`;
		const title = this.createLabel(name, propId);
		const content = this.createContent(value, propId);
		this.appendChild(title);
		this.appendChild(content);
	}
}
