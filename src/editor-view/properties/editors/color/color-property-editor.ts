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

	protected getDefaultValue() { return 0xFFFFFF; }

	public setInternalValue(value: number) {
		if (value === null || isNaN(value)) return;
		this._internalValue = value;
		this.input.value = '#' + value.toString(16).toUpperCase();
	}

	public updateInternalValue(): number {
		let hex = this.input.value;
		const hashMissing = !hex.startsWith('#');
		if (!hashMissing) hex = hex.substr(1);
		if (hex.length === 3) {
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		}

		this.setInternalValue(parseInt(hex, 16));
		return this._internalValue;
	}

	protected valueToJson() { return JSON.stringify(this.input.value); }
}

customElements.define(ComponentTags.ColorPropertyEditor, ColorPropertyEditor);
