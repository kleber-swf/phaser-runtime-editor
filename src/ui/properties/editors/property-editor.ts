import { Data, DataOrigin } from 'data';
import { PropertyInspectionData } from 'ui/properties-editors';
import './property-editor.scss';

export abstract class PropertyEditor<T> extends HTMLElement {
	protected prop: PropertyInspectionData;
	protected changedOnEditor = false;

	protected static randomId() { return (Math.floor(Math.random() * 1000000)).toString(16); }

	public connectedCallback() {
		this.classList.add('property-editor');
	}

	public setContent(prop: PropertyInspectionData, value: T, fieldId?: string) {
		fieldId = fieldId ?? `${prop.name}-${PropertyEditor.randomId()}`;
		this.prop = prop;
		const title = this.createLabel(fieldId, prop);
		const content = this.createContent(value, fieldId, prop);
		this.appendChild(title);
		this.appendChild(content);
	}

	protected createLabel(fieldId: string, prop: PropertyInspectionData): HTMLElement {
		const label = document.createElement('label');
		label.classList.add('property-title');
		label.append(prop.name);
		label.setAttribute('for', fieldId);
		return label;
	}

	protected createContent(value: T, fieldId: string, prop: PropertyInspectionData) {
		const propContent = document.createElement('div');
		propContent.classList.add('property-content');

		const innerContent = this.createInnerContent(value, fieldId, prop);
		propContent.append(innerContent);

		return propContent;
	}

	protected abstract createInnerContent(value: T, fieldId: string, prop: PropertyInspectionData): HTMLElement;

	public updateContent(value: T) {
		this.changedOnEditor = true;
		this.doUpdateContent(value);
	}

	/**
	 * Actually updates the value coming from the editor
	 * @param value The value set on editor
	 */
	public abstract doUpdateContent(value: T): void;


	protected onValueChanged(e: Event) {
		if (this.changedOnEditor) this.changedOnEditor = false;
		else Data.propertyChanged(this.prop.name, this.getInternalValue(e), DataOrigin.INSPECTOR);
	}

	public abstract getInternalValue(e: Event): T;
}
