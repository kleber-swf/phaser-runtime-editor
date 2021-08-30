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

	protected createContent(value: T, propertyId: string) {
		const propContent = document.createElement('div');
		propContent.classList.add('property-content');

		const innerContent = this.createInnerContent(value, propertyId);
		propContent.append(innerContent);

		return propContent;
	}

	protected abstract createInnerContent(value: T, propertyId: string): HTMLElement;

	public setContent(name: string, value: T) {
		const propId = `prop-${name}`;
		const title = this.createLabel(name, propId);
		const content = this.createContent(value, propId);
		this.appendChild(title);
		this.appendChild(content);
	}
}
