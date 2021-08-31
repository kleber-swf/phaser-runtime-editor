import { PropertyInspectionData } from 'ui/properties-editors';
import { PropertyEditor } from '../property-editor';

export class StringPropertyEditor extends PropertyEditor<string> {
	public static readonly tagName: string = 'phed-string-property-editor';

	protected createInnerContent(value: string, propertyId: string, prop: PropertyInspectionData) {
		const input = document.createElement('input');
		input.id = propertyId;
		input.setAttribute('type', 'text');
		input.setAttribute('value', value ?? '');
		if (prop.data) Object.keys(prop.data).forEach(p => input.setAttribute(p, prop.data[p]));
		return input;
	}
}

customElements.define(StringPropertyEditor.tagName, StringPropertyEditor);
