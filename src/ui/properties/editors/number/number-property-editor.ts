import { PropertyInspectionData } from 'ui/properties-editors';
import { PropertyEditor } from '../property-editor';

export class NumberPropertyEditor extends PropertyEditor<number> {
	public static readonly tagName: string = 'phed-number-property-editor';

	private input: HTMLInputElement;

	protected createInnerContent(value: number, fieldId: string, prop: PropertyInspectionData) {
		value = value === null || isNaN(value) ? 0 : value;
		const input = this.input = document.createElement('input');
		input.id = fieldId;

		input.setAttribute('type', 'number');
		this.input.value = value.toString();
		this.onchange = this.onValueChanged.bind(this);

		if (prop.data) Object.keys(prop.data).forEach(p => input.setAttribute(p, prop.data[p]));

		return input;
	}

	public doUpdateContent(value: number) {
		value = value === null || isNaN(value) ? 0 : value;
		this.input.value = value.toString();
	}

	public getInternalValue() {
		const value = parseFloat(this.input.value);
		return isNaN(value) ? 0 : value;
	}
}

customElements.define(NumberPropertyEditor.tagName, NumberPropertyEditor);
