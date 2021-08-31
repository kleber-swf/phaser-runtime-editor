import { PropertyInspectionData } from 'ui/properties-editors';
import { PropertyEditor } from '../property-editor';

export class BooleanPropertyEditor extends PropertyEditor<boolean> {
	public static readonly tagName: string = 'phed-boolean-property-editor';

	protected createInnerContent(value: boolean, propertyId: string, prop: PropertyInspectionData) {
		const input = document.createElement('input');
		input.id = propertyId;

		input.setAttribute('type', 'checkbox');
		if (value) input.setAttribute('checked', '');
		if (prop.data) Object.keys(prop.data).forEach(p => input.setAttribute(p, prop.data[p]));

		return input;
	}
}

customElements.define(BooleanPropertyEditor.tagName, BooleanPropertyEditor);
