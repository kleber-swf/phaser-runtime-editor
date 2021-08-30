import { PropertyEditor } from '../property-editor';

export class StringPropertyEditor extends PropertyEditor<string> {
	public static readonly tagName: string = 'phed-string-property-editor';

	protected createContent(value: string, propertyId: string) {
		const propContent = document.createElement('div');
		propContent.classList.add('property-content');

		const input = this.createInput(value, propertyId);
		propContent.append(input);

		return propContent;
	}

	protected createInput(value: string, propertyId: string) {
		const input = document.createElement('input');
		input.id = propertyId;
		input.setAttribute('type', 'text');
		input.setAttribute('value', value ?? '');
		return input;
	}
}

customElements.define(StringPropertyEditor.tagName, StringPropertyEditor);
