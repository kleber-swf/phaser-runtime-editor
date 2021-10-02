import { InspectorPropertyModel } from 'data/inspector-data';
import { ComponentTags } from 'component-tags';
import { NumberPropertyEditor } from '../number/number-property-editor';
import { PropertyEditor } from '../property-editor';
import './rect-property-editor.scss';

export class RectPropertyEditor extends PropertyEditor<PIXI.Rectangle> {
	private xinput: NumberPropertyEditor;
	private yinput: NumberPropertyEditor;
	private winput: NumberPropertyEditor;
	private hinput: NumberPropertyEditor;

	private internalValue = new Phaser.Rectangle();

	public connectedCallback() {
		super.connectedCallback();
		this.classList.add('has-children');
	}

	protected createInnerContent(fieldId: string, value: PIXI.Rectangle, prop: InspectorPropertyModel) {
		const parent = this.appendChild(document.createElement('div'));
		parent.classList.add('vertical-content');

		if (!value) {
			value = new PIXI.Rectangle();
			prop.data = prop.data ?? {};
			prop.data.readonly = true;
		}

		const xinput = this.xinput = document.createElement(ComponentTags.NumberPropertyEditor) as NumberPropertyEditor;
		xinput.setContent({ name: 'x', typeHint: 'number', data: prop.data }, value.x, false, fieldId);
		xinput.onchange = this.onInputChanged.bind(this);
		parent.appendChild(xinput);

		const yinput = this.yinput = document.createElement(ComponentTags.NumberPropertyEditor) as NumberPropertyEditor;
		yinput.setContent({ name: 'y', typeHint: 'number', data: prop.data }, value.y, false);
		yinput.onchange = this.onInputChanged.bind(this);
		parent.appendChild(yinput);

		const winput = this.winput = document.createElement(ComponentTags.NumberPropertyEditor) as NumberPropertyEditor;
		winput.setContent({ name: 'width', typeHint: 'number', data: prop.data }, value.width, false);
		winput.onchange = this.onInputChanged.bind(this);
		parent.appendChild(winput);

		const hinput = this.hinput = document.createElement(ComponentTags.NumberPropertyEditor) as NumberPropertyEditor;
		hinput.setContent({ name: 'height', typeHint: 'number', data: prop.data }, value.height, false);
		hinput.onchange = this.onInputChanged.bind(this);
		parent.appendChild(hinput);

		return parent;
	}

	protected onInputChanged(e: Event) { this.onValueChanged(e, true); }

	protected onValueChanged(e: Event, save?: boolean) {
		if (save) this.savePreviousValue();
		super.onValueChanged(e, false);
	}

	protected getDefaultValue() { return new PIXI.Rectangle(); }
	public getInternalValue() { return this.internalValue.clone(); }

	public setInternalValue(value: Phaser.Rectangle) {
		this.xinput.setInternalValue(value.x);
		this.yinput.setInternalValue(value.y);
		this.winput.setInternalValue(value.width);
		this.hinput.setInternalValue(value.height);
		this.internalValue.setTo(value.x, value.y, value.width, value.height);
	}

	public updateInternalValue(): PIXI.Rectangle {
		this.xinput.updateInternalValue();
		this.yinput.updateInternalValue();
		this.winput.updateInternalValue();
		this.hinput.updateInternalValue();
		this.internalValue.setTo(
			this.xinput.getInternalValue(),
			this.yinput.getInternalValue(),
			this.winput.getInternalValue(),
			this.hinput.getInternalValue(),
		);
		return this._internalValue;
	}

	protected copyToClipboard() {
		const value = this.getInternalValue();
		navigator.clipboard
			.writeText(`"${this.prop.name}": ${JSON.stringify({
				x: value.x,
				y: value.y,
				width: value.width,
				height: value.height,
			})}`);
	}
}

customElements.define(ComponentTags.RectPropertyEditor, RectPropertyEditor);
