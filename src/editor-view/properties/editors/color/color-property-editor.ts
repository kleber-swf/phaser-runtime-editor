import { ComponentTags } from 'component-tags';
import { InspectorPropertyModel } from 'data/inspector-data';
import { PropertyEditor } from '../property-editor';

export class ColorPropertyEditor extends PropertyEditor<number> {
	private input: HTMLInputElement;

	protected createInnerContent(fieldId: string, _value: number, prop: InspectorPropertyModel) {
		const input = this.input = document.createElement('input');
		input.id = fieldId;
		input.setAttribute('type', 'text');
		if (prop.data) Object.keys(prop.data).forEach(p => input.setAttribute(p, prop.data[p]));
		return input;
	}

	public setInternalValue(value: number) {
		value = value === null || isNaN(value) ? 0 : value;
		this._internalValue = value;
		this.input.value = '#' + value.toString(16).toUpperCase();
	}

	public updateInternalValue(): number {
		let hex = this.input.value;
		const hashMissing = !hex.startsWith('#');
		if (!hashMissing) hex = hex.substr(1);
		if (hex.length === 3)
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];

		const ivalue = parseInt(hex, 16);
		if (!isNaN(ivalue)) {
			this.setInternalValue(ivalue);
		}

		return this._internalValue;
	}
}

customElements.define(ComponentTags.ColorPropertyEditor, ColorPropertyEditor);
