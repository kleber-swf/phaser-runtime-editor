import { Data, DataOrigin } from 'data/data';
import { History } from 'data/history';
import { PropertyInspectionData } from 'editor/properties-editors';
import { IdUtil } from 'util/id.util';
import './property-editor.scss';

export abstract class PropertyEditor<T> extends HTMLElement {
	protected prop: PropertyInspectionData;
	public changedOutsideInspector = false;

	protected _internalValue: T;

	public connectedCallback() {
		this.classList.add('property-editor');
	}

	public setContent(prop: PropertyInspectionData, value: T, fieldId?: string) {
		fieldId = fieldId ?? `${prop.name}-${IdUtil.genHexId()}`;
		this.prop = prop;

		const titleCol = this.appendChild(document.createElement('div'));
		titleCol.classList.add('property-title', prop.name);
		titleCol.appendChild(this.createLabel(fieldId, prop));

		this.appendChild(this.createContent(value, fieldId, prop));

		this.setInternalValue(value);
		this.onchange = this.onValueChanged.bind(this);
	}

	protected createLabel(fieldId: string, prop: PropertyInspectionData): HTMLElement {
		const label = document.createElement('label');
		label.append(prop.label ?? prop.name);
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

	public propertyChangedOutsideInspector(value: T) {
		this.changedOutsideInspector = true;
		this.setInternalValue(value);
	}

	protected onValueChanged(e: Event, save = true) {
		if (this.changedOutsideInspector) {
			this.changedOutsideInspector = false;
			return;
		}
		if (save) this.savePreviousValue();
		this.updateInternalValue(e);
		Data.propertyChanged(this.prop.name, this.getInternalValue(), DataOrigin.INSPECTOR);
	}

	public getInternalValue(): T { return this._internalValue; }
	public abstract setInternalValue(value: T): void;
	public abstract updateInternalValue(e: Event): void;

	public savePreviousValue() {
		History.prepare(Data.selectedObject, {
			[this.prop.name]: this.getInternalValue()
		}).commit();
	}
}
