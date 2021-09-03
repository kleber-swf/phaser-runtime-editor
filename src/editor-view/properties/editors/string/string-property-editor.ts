import { PropertyInspectionData } from 'editor-view/properties-editors';
import { PropertyEditor } from '../property-editor';

export class StringPropertyEditor extends PropertyEditor<string> {
	public static readonly tagName: string = 'phed-string-property-editor';
	private input: HTMLInputElement;

	protected createInnerContent(fieldId: string, _value: string, prop: PropertyInspectionData) {
		const input = this.input = document.createElement('input');
		input.id = fieldId;
		input.setAttribute('type', 'text');
		if (prop.data) Object.keys(prop.data).forEach(p => input.setAttribute(p, prop.data[p]));
		return input;
	}

	public setInternalValue(value: string) {
		value = value ?? '';
		this._internalValue = value;
		this.input.value = value;
	}

	public updateInternalValue(): string {
		const value = this.input.value || '';
		this._internalValue = value;
		return value;
	}
}

customElements.define(StringPropertyEditor.tagName, StringPropertyEditor);
