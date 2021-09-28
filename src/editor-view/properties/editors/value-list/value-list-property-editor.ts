import { ComponentTags } from 'component-tags';
import { InspectorPropertyModel } from 'data/inspector-data';
import { PropertyEditor } from '../property-editor';

export class ValueListPropertyEditor extends PropertyEditor<any> {
	private select: HTMLSelectElement;

	protected createInnerContent(fieldId: string, _value: number, prop: InspectorPropertyModel) {
		const select = this.select = document.createElement('select');
		select.id = fieldId;

		(prop.values || []).forEach(v => {
			const option = document.createElement('option');
			option.value = v.value;
			option.innerHTML = v.label;
			select.appendChild(option);
		});

		if (prop.data) Object.keys(prop.data).forEach(p => select.setAttribute(p, prop.data[p]));
		return select;
	}

	public setInternalValue(value: number) {
		const options = this.select.options;
		if (value === null || isNaN(value) || value < 0 || value >= options.length) return;
		this._internalValue = options[value].value;
		options[value].selected = true;
	}

	public updateInternalValue(): any {
		const index = parseInt(this.select.value, 10);
		this.setInternalValue(index);
		return this._internalValue;
	}
}

customElements.define(ComponentTags.ValueListPropertyEditor, ValueListPropertyEditor);
