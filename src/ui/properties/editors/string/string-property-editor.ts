import { PropertyInspectionData } from 'ui/properties-editors';
import { PropertyEditor } from '../property-editor';

export class StringPropertyEditor extends PropertyEditor<string> {
	public static readonly tagName: string = 'phed-string-property-editor';
	private input: HTMLInputElement;

	protected createInnerContent(value: string, fieldId: string, prop: PropertyInspectionData) {
		const input = this.input = document.createElement('input');
		input.id = fieldId;
		input.setAttribute('type', 'text');
		input.setAttribute('value', value ?? '');
		this.onchange = this.onValueChanged.bind(this);

		if (prop.data) Object.keys(prop.data).forEach(p => input.setAttribute(p, prop.data[p]));
		return input;
	}

	public doUpdateContent(value: string) { this.input.setAttribute('value', value ?? ''); }
	public getInternalValue() { return this.input.value || ''; }
}

customElements.define(StringPropertyEditor.tagName, StringPropertyEditor);
