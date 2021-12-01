import { ComponentTags } from 'component-tags';
import { InspectorPropertyModel } from 'data/inspector-data';
import { PropertyEditor } from '../property-editor';

export class ValueListPropertyEditor extends PropertyEditor<any> {
	private select: HTMLSelectElement;

	protected createInnerContent(fieldId: string, _value: number, prop: InspectorPropertyModel) {
		const select = this.select = document.createElement('select');
		select.id = fieldId;

		let values: { value: any, label: string }[];
		if (!prop.values) prop.values = [];

		if (Array.isArray(prop.values)) {
			values = prop.values.map(v => (typeof v === 'object' ? v : { value: v, label: v }));
		} else {
			values = Object.keys(prop.values).map((label, value) => ({ value, label }));
		}

		values.forEach(v => {
			const option = document.createElement('option');
			option.value = v.value;
			option.innerHTML = v.label;
			select.appendChild(option);
		});

		if (prop.data) Object.keys(prop.data).forEach(p => select.setAttribute(p, prop.data[p]));
		return select;
	}

	protected getDefaultValue() { return 0; }

	public setInternalValue(value: number | any) {
		const options = this.select.options;
		if (typeof value === 'number') {
			if (value === null || isNaN(value) || value < 0 || value >= options.length) {
				console.warn(`Invalud value: ${value}`);
				return;
			}
			this._internalValue = options[value].value;
			options[value].selected = true;
		} else {
			for (let i = 0; i < options.length; i++) {
				if (options[i].value !== value) continue;
				this._internalValue = options[i].value;
				options[i].selected = true;
				return;
			}
		}
	}

	public updateInternalValue(): any {
		// TODO what if the value is a number (instead of index)
		if (typeof this.select.value === 'number') {
			const index = parseInt(this.select.value, 10);
			this.setInternalValue(index);
		} else this.setInternalValue(this.select.value);
		return this._internalValue;
	}

	protected valueToJson() { return this._internalValue.toString(); }
}

customElements.define(ComponentTags.ValueListPropertyEditor, ValueListPropertyEditor);
