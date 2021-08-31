import { PropertyInspectionData } from 'ui/properties-editors';
import { PropertyEditor } from '../property-editor';
import './number-property-editor.scss';

export class NumberPropertyEditor extends PropertyEditor<number> {
	public static readonly tagName: string = 'phed-number-property-editor';

	protected createInnerContent(value: number, propertyId: string, prop: PropertyInspectionData) {
		value = value === null || isNaN(value) ? 0 : value;
		const input = document.createElement('input');
		input.id = propertyId;

		input.setAttribute('type', 'number');
		input.setAttribute('value', value.toString());
		if (prop.data) Object.keys(prop.data).forEach(p => input.setAttribute(p, prop.data[p]));

		return input;
	}
}

customElements.define(NumberPropertyEditor.tagName, NumberPropertyEditor);
