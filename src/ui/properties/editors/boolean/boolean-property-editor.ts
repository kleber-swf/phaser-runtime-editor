import { Data, DataOrigin } from 'data';
import { PropertyInspectionData } from 'ui/properties-editors';
import { PropertyEditor } from '../property-editor';

export class BooleanPropertyEditor extends PropertyEditor<boolean> {
	public static readonly tagName: string = 'phed-boolean-property-editor';

	private input: HTMLInputElement;

	protected createInnerContent(value: boolean, fieldId: string, prop: PropertyInspectionData) {
		const input = document.createElement('input');
		input.id = fieldId;

		input.setAttribute('type', 'checkbox');
		if (value) input.setAttribute('checked', '');
		if (prop.data) Object.keys(prop.data).forEach(p => input.setAttribute(p, prop.data[p]));
		this.onchange = this.onValueChanged.bind(this);

		return input;
	}

	public doUpdateContent(value: boolean) {
		if (value) this.input.setAttribute('checked', '');
		else this.input.removeAttribute('checked');
	}

	public getInternalValue() { return this.input.checked; }
}

customElements.define(BooleanPropertyEditor.tagName, BooleanPropertyEditor);
