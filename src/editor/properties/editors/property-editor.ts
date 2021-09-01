import { Data, DataOrigin } from 'data/data';
import { PropertyInspectionData } from 'editor/properties-editors';
import './property-editor.scss';

export abstract class PropertyEditor<T> extends HTMLElement {
	protected prop: PropertyInspectionData;
	protected changedOnEditor = false;

	protected _internalValue: T;

	protected static randomId() { return (Math.floor(Math.random() * 1000000)).toString(16); }

	public connectedCallback() {
		this.classList.add('property-editor');
	}

	public setContent(prop: PropertyInspectionData, value: T, fieldId?: string) {
		fieldId = fieldId ?? `${prop.name}-${PropertyEditor.randomId()}`;
		this.prop = prop;

		const titleCol = document.createElement('div');
		titleCol.classList.add('property-title', prop.name);

		const title = this.createLabel(fieldId, prop);
		titleCol.appendChild(title);

		const contentCol = this.createContent(value, fieldId, prop);

		this.setInternalValue(value);
		this.onchange = this.onValueChanged.bind(this);

		this.appendChild(titleCol);
		this.appendChild(contentCol);
	}

	protected createLabel(fieldId: string, prop: PropertyInspectionData): HTMLElement {
		const label = document.createElement('label');
		label.append(prop.name);
		label.setAttribute('for', fieldId);
		return label;
	}

	protected createContent(value: T, fieldId: string, prop: PropertyInspectionData) {
		const propContent = document.createElement('div');
		propContent.classList.add('property-content', prop.name);

		const innerContent = this.createInnerContent(fieldId, value, prop);
		propContent.append(innerContent);

		return propContent;
	}

	protected abstract createInnerContent(fieldId: string, value: T, prop: PropertyInspectionData): HTMLElement;

	public updateContent(value: T) {
		this.changedOnEditor = true;
		this.setInternalValue(value);
	}


	protected onValueChanged(e: Event) {
		if (this.changedOnEditor) this.changedOnEditor = false;
		else {
			this.updateInternalValue(e);
			Data.propertyChanged(this.prop.name, this.getInternalValue(), DataOrigin.INSPECTOR);
		}
	}

	public getInternalValue(): T { return this._internalValue; }
	public abstract setInternalValue(value: T): void;
	public abstract updateInternalValue(e: Event): void;
}
