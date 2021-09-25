import { InspectorPropertyModel } from 'data/inspector-data';
import { ComponentTags } from 'component-tags';
import { PropertyEditor } from '../property-editor';

export class TextPropertyEditor extends PropertyEditor<string> {
	private input: HTMLTextAreaElement;

	protected createInnerContent(fieldId: string, _value: string, prop: InspectorPropertyModel) {
		const input = this.input = document.createElement('textarea');
		input.id = fieldId;
		input.onkeydown = e => {
			if (e.ctrlKey && e.code === 'Enter') {
				e.preventDefault();
				this.dispatchEvent(new Event('change'));
			}
		};
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

customElements.define(ComponentTags.TextPropertyEditor, TextPropertyEditor);
