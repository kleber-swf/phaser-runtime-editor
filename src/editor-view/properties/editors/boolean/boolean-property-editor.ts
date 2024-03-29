import { InspectorPropertyModel } from 'data/inspector-data';
import { PropertyElementTag } from 'property-element-tag';
import { PropertyEditor } from '../property-editor';

export class BooleanPropertyEditor extends PropertyEditor<boolean> {
	private input: HTMLInputElement;

	protected createInnerContent(fieldId: string, _value: boolean, prop: InspectorPropertyModel) {
		const input = this.input = document.createElement('input');
		input.id = fieldId;
		input.setAttribute('type', 'checkbox');
		if (prop.data) Object.keys(prop.data).forEach(p => input.setAttribute(p, prop.data[p]));
		return input;
	}

	protected getDefaultValue() { return false; }

	public setInternalValue(value: boolean) {
		this.input.checked = value;
		this._internalValue = value;
	}

	public updateInternalValue(): boolean {
		this._internalValue = this.input.checked;
		return this._internalValue;
	}
}

customElements.define(PropertyElementTag.BooleanPropertyEditor, BooleanPropertyEditor);
