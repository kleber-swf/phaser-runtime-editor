import { PropertyInspectionData } from 'ui/properties-editors';
import './property-editor.scss';

export abstract class PropertyEditor<T> extends HTMLElement {
	public connectedCallback() {
		this.classList.add('property-editor');
	}

	protected createLabel(propertyId: string, prop: PropertyInspectionData): HTMLElement {
		const label = document.createElement('label');
		label.classList.add('property-title');
		label.append(prop.name);
		label.setAttribute('for', propertyId);
		return label;
	}

	protected createContent(value: T, propertyId: string, prop: PropertyInspectionData) {
		const propContent = document.createElement('div');
		propContent.classList.add('property-content');

		const innerContent = this.createInnerContent(value, propertyId, prop);
		propContent.append(innerContent);

		return propContent;
	}

	protected abstract createInnerContent(value: T, propertyId: string, prop: PropertyInspectionData): HTMLElement;

	public setContent(prop: PropertyInspectionData, value: T) {
		const propId = `prop-${prop.name}`;
		const title = this.createLabel(propId, prop);
		const content = this.createContent(value, propId, prop);
		this.appendChild(title);
		this.appendChild(content);
	}
}
