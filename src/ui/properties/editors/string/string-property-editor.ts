import { PropertyEditor } from '../property-editor';

export class StringPropertyEditor extends PropertyEditor<string> {
	public static readonly tagName: string = 'phed-string-property-editor';

	protected createInnerContent(value: string, propertyId: string) {
		const input = document.createElement('input');
		input.id = propertyId;
		input.setAttribute('type', 'text');
		input.setAttribute('value', value ?? '');
		return input;
	}
}

customElements.define(StringPropertyEditor.tagName, StringPropertyEditor);
