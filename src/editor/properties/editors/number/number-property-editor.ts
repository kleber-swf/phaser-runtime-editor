import { PropertyInspectionData } from 'editor/properties-editors';
import { PropertyEditor } from '../property-editor';

export class NumberPropertyEditor extends PropertyEditor<number> {
	public static readonly tagName: string = 'phed-number-property-editor';

	private input: HTMLInputElement;

	protected createInnerContent(fieldId: string, _value: number, prop: PropertyInspectionData) {
		const input = this.input = document.createElement('input');
		input.id = fieldId;
		input.setAttribute('type', 'number');
		if (prop.data) Object.keys(prop.data).forEach(p => input.setAttribute(p, prop.data[p]));
		return input;
	}

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

customElements.define(NumberPropertyEditor.tagName, NumberPropertyEditor);