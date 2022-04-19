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

	protected getDefaultValue() { return '#000'; }

	public setInternalValue(value: string) {
		// TODO use some Phaser function for this
		// TODO validate color names
		if (value === null) return;
		const hasHash = value.startsWith('#');
		const intValue = parseInt(hasHash ? value.substring(1) : value, 16);
		if (intValue < 0 || intValue > 0xFFFFFF) return;
		if (!hasHash) value = '#' + value.toUpperCase();
		this._internalValue = value;
		this.input.value = value;
	}

	public updateInternalValue(): string {
		this.setInternalValue(this.input.value);
		return this._internalValue;
	}

	protected valueToJson() { return JSON.stringify(this.input.value); }
}

customElements.define(PropertyElementTag.CssColorPropertyEditor, CssColorPropertyEditor);
