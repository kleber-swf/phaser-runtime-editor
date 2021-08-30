import { PropertyEditor } from '../property-editor';

export class BooleanPropertyEditor extends PropertyEditor<boolean> {
	public static readonly tagName: string = 'phed-boolean-property-editor';

	protected createInnerContent(value: boolean, propertyId: string) {
		const input = document.createElement('input');
		input.id = propertyId;

		input.setAttribute('type', 'checkbox');
		if (value) input.setAttribute('checked', '');

		return input;
	}
}

customElements.define(BooleanPropertyEditor.tagName, BooleanPropertyEditor);
