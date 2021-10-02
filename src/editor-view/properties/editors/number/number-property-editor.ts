import { InspectorPropertyModel } from 'data/inspector-data';
import { ComponentTags } from 'component-tags';
import { PropertyEditor } from '../property-editor';

export class NumberPropertyEditor extends PropertyEditor<number> {
	private input: HTMLInputElement;

	protected createInnerContent(fieldId: string, _value: number, prop: InspectorPropertyModel) {
		const input = this.input = document.createElement('input');
		input.id = fieldId;
		input.setAttribute('type', 'number');
		if (prop.data) Object.keys(prop.data).forEach(p => input.setAttribute(p, prop.data[p]));
		return input;
	}

	protected getDefaultValue() { return 0; }

	public setInternalValue(value: number) {
		value = value === null || isNaN(value) ? 0 : value;
		this._internalValue = value;
		this.input.value = value.toString();
	}

	public updateInternalValue(): number {
		const value = parseFloat(this.input.value);
		this._internalValue = isNaN(value) ? 0 : value;
		return this._internalValue;
	}
}

customElements.define(ComponentTags.NumberPropertyEditor, NumberPropertyEditor);
