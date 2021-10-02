import { InspectorPropertyModel } from 'data/inspector-data';
import { ComponentTags } from 'component-tags';
import { NumberPropertyEditor } from '../number/number-property-editor';
import { PropertyEditor } from '../property-editor';
import './point-property-editor.scss';

export class PointPropertyEditor extends PropertyEditor<PIXI.Point> {
	private xinput: NumberPropertyEditor;
	private yinput: NumberPropertyEditor;
	private internalValue = new Phaser.Point();

	public connectedCallback() {
		super.connectedCallback();
		this.classList.add('has-children');
	}

	protected createInnerContent(fieldId: string, value: PIXI.Point, prop: InspectorPropertyModel) {
		const parent = this.appendChild(document.createElement('div'));
		parent.classList.add('vertical-content')

		const xinput = this.xinput = document.createElement(ComponentTags.NumberPropertyEditor) as NumberPropertyEditor;
		xinput.setContent({ name: 'x', typeHint: 'number', data: prop.data }, value.x, false, fieldId);
		xinput.onchange = this.onInputChanged.bind(this);
		parent.appendChild(xinput);

		const yinput = this.yinput = document.createElement(ComponentTags.NumberPropertyEditor) as NumberPropertyEditor;
		yinput.setContent({ name: 'y', typeHint: 'number', data: prop.data }, value.y, false);
		yinput.onchange = this.onInputChanged.bind(this);
		parent.appendChild(yinput);

		return parent;
	}

	protected onInputChanged(e: Event) { this.onValueChanged(e, true); }

	protected onValueChanged(e: Event, save?: boolean) {
		if (save) this.savePreviousValue();
		super.onValueChanged(e, false);
	}

	protected getDefaultValue() { return new PIXI.Point(); }

	public getInternalValue() { return this.internalValue.clone(); }

	public setInternalValue(value: PIXI.Point) {
		this.xinput.setInternalValue(value.x);
		this.yinput.setInternalValue(value.y);
		this.internalValue.set(value.x, value.y);
	}

	public updateInternalValue(): PIXI.Point {
		this.xinput.updateInternalValue();
		this.yinput.updateInternalValue();
		this.internalValue.set(this.xinput.getInternalValue(), this.yinput.getInternalValue());
		return this._internalValue;
	}

	protected copyToClipboard() {
		const value = this.getInternalValue();
		navigator.clipboard
			.writeText(`"${this.prop.name}": ${JSON.stringify({ x: value.x, y: value.y })}`);
	}
}

customElements.define(ComponentTags.PointPropertyEditor, PointPropertyEditor);
