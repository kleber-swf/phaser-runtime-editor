import { PropertyInspectionData } from 'ui/properties-editors';
import { PropertyEditor } from '../property-editor';

export class BooleanPropertyEditor extends PropertyEditor<boolean> {
	public static readonly tagName: string = 'phed-boolean-property-editor';

	private input: HTMLElement;

	protected createInnerContent(value: boolean, fieldId: string, prop: PropertyInspectionData) {
		const input = document.createElement('input');
		input.id = fieldId;

		input.setAttribute('type', 'checkbox');
		if (value) input.setAttribute('checked', '');
		if (prop.data) Object.keys(prop.data).forEach(p => input.setAttribute(p, prop.data[p]));
		return input;
	}

	public updateContent(value: boolean) {
		if (value) this.input.setAttribute('checked', '');
		else this.input.removeAttribute('checked');
	}

}

customElements.define(BooleanPropertyEditor.tagName, BooleanPropertyEditor);
