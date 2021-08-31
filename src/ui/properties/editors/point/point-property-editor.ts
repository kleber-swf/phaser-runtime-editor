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

	protected createInnerContent(value: PIXI.Point, fieldId: string) {
		value = value ?? new PIXI.Point(0, 0);
		this.internalValue.set(value.x, value.y);

		const parent = document.createElement('div');
		this.appendChild(parent);

		const xinput = this.xinput = document.createElement(NumberPropertyEditor.tagName,) as NumberPropertyEditor;
		xinput.setContent({ name: 'x', typeHint: 'number' }, value.x, fieldId);
		xinput.onchange = null;//this.onValueChanged.bind(this);
		parent.appendChild(xinput);
		
		const yinput = this.yinput = document.createElement(NumberPropertyEditor.tagName) as NumberPropertyEditor;
		yinput.setContent({ name: 'y', typeHint: 'number' }, value.y);
		yinput.onchange = null;//this.onValueChanged.bind(this);
		parent.appendChild(yinput);

		this.onchange = this.onValueChanged.bind(this);

		return parent;
	}

	public doUpdateContent(value: PIXI.Point) {
		this.xinput.doUpdateContent(value.x);
		this.yinput.doUpdateContent(value.y);
		this.internalValue.set(value.x, value.y);
	}

	public getInternalValue() {
		this.internalValue.set(this.xinput.getInternalValue(), this.yinput.getInternalValue());
		return this.internalValue.clone();
	}
}

customElements.define(PointPropertyEditor.tagName, PointPropertyEditor);
