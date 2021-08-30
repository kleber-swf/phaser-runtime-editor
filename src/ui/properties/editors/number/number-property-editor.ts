import { PropertyEditor } from '../property-editor';
import './number-property-editor.scss';

export class NumberPropertyEditor extends PropertyEditor<number> {
	public static readonly tagName: string = 'phed-number-property-editor';

	protected createContent(value: number, propertyId: string) {
		const propContent = document.createElement('div');
		propContent.classList.add('property-content');

		const input = this.createInput(value, propertyId);
		propContent.append(input);

		return propContent;
	}

	protected createInput(value: number, propertyId: string) {
		value = value === null || isNaN(value) ? 0 : value;
		const input = document.createElement('input');
		input.id = propertyId;

		input.setAttribute('type', 'number');
		input.setAttribute('value', value.toString());

		return input;
	}
}

customElements.define(NumberPropertyEditor.tagName, NumberPropertyEditor);
