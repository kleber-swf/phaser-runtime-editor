import { PropertyInspectionData } from 'ui/properties-editors';
import { PropertyEditor } from '../property-editor';

export class NumberPropertyEditor extends PropertyEditor<number> {
	public static readonly tagName: string = 'phed-number-property-editor';

	private input: HTMLElement;

	protected createInnerContent(value: number, fieldId: string, prop: PropertyInspectionData) {
		value = value === null || isNaN(value) ? 0 : value;
		const input = this.input = document.createElement('input');
		input.id = fieldId;

		input.setAttribute('type', 'number');
		input.setAttribute('value', value.toString());
		if (prop.data) Object.keys(prop.data).forEach(p => input.setAttribute(p, prop.data[p]));

		return input;
	}

	public updateContent(value: number) {
		value = value === null || isNaN(value) ? 0 : value;
		this.input.setAttribute('value', value.toString());
	}
}

customElements.define(NumberPropertyEditor.tagName, NumberPropertyEditor);
