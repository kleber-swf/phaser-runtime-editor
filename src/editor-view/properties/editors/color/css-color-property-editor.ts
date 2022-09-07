import { PropertyElementTag } from 'property-element-tag';
import { InspectorPropertyModel } from 'data/inspector-data';
import { PropertyEditor } from '../property-editor';

export class CssColorPropertyEditor extends PropertyEditor<string> {
	private input: HTMLInputElement;

	protected createInnerContent(fieldId: string, _value: string, prop: InspectorPropertyModel) {
		const input = this.input = document.createElement('input');
		input.id = fieldId;
		input.setAttribute('type', 'text');
		if (prop.data) Object.keys(prop.data).forEach(p => input.setAttribute(p, prop.data[p]));
		return input;
	}

	protected getDefaultValue() { return '#FFFFFF'; }

	public setInternalValue(value: string) {
		if (!value) return;
		if (!isNaN(parseInt(value, 16))) {
			value = '#' + value;
		}
		const s = new Option().style;
		s.color = value;
		if (s.color !== '') {
			this._internalValue = value;
			this.input.value = value;
		} else {
			this.input.value = this._internalValue;
		}
	}

	public updateInternalValue(): string {
		this.setInternalValue(this.input.value);
		return this._internalValue;
	}

	protected valueToJson() { return JSON.stringify(this.input.value); }
}

customElements.define(PropertyElementTag.CssColorPropertyEditor, CssColorPropertyEditor);
