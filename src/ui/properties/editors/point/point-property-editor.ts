import { PropertyInspectionData } from 'ui/properties-editors';
import { NumberPropertyEditor } from '../number/number-property-editor';
import { PropertyEditor } from '../property-editor';

export class PointPropertyEditor extends PropertyEditor<PIXI.Point> {
	public static readonly tagName: string = 'phed-point-property-editor';

	private xinput: NumberPropertyEditor;
	private yinput: NumberPropertyEditor;
	private internalValue = new Phaser.Point();

	public connectedCallback() {
		super.connectedCallback();
		this.classList.add('has-children');
	}

	protected createInnerContent(fieldId: string, value: PIXI.Point, prop: PropertyInspectionData) {
		const parent = document.createElement('div');
		this.appendChild(parent);

		const xinput = this.xinput = document.createElement(NumberPropertyEditor.tagName,) as NumberPropertyEditor;
		xinput.setContent({ name: 'x', typeHint: 'number', data: prop.data }, value.x, fieldId);
		xinput.onchange = this.onValueChanged.bind(this);
		parent.appendChild(xinput);
		
		const yinput = this.yinput = document.createElement(NumberPropertyEditor.tagName) as NumberPropertyEditor;
		yinput.setContent({ name: 'y', typeHint: 'number', data: prop.data }, value.y);
		xinput.onchange = this.onValueChanged.bind(this);
		parent.appendChild(yinput);

		return parent;
	}

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
}

customElements.define(PointPropertyEditor.tagName, PointPropertyEditor);
