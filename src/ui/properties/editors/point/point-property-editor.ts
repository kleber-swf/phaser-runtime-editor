import { NumberPropertyEditor } from '../number/number-property-editor';
import { PropertyEditor } from '../property-editor';

export class PointPropertyEditor extends PropertyEditor<PIXI.Point> {
	public static readonly tagName: string = 'phed-point-property-editor';

	private xinput: NumberPropertyEditor;
	private yinput: NumberPropertyEditor;

	public connectedCallback() {
		super.connectedCallback();
		this.classList.add('has-children');
	}

	protected createInnerContent(value: PIXI.Point, propertyId: string) {
		value = value ?? new PIXI.Point(0, 0);

		const parent = document.createElement('div');
		this.appendChild(parent);

		const xinput = this.xinput = document.createElement(NumberPropertyEditor.tagName) as NumberPropertyEditor;
		xinput.setContent({ name: 'x', typeHint: 'number' }, value.x);
		xinput.id = propertyId;
		parent.appendChild(xinput);

		const yinput = this.yinput = document.createElement(NumberPropertyEditor.tagName) as NumberPropertyEditor;
		yinput.setContent({ name: 'y', typeHint: 'number' }, value.y);
		yinput.id = propertyId;
		parent.appendChild(yinput);

		return parent;
	}

	public updateContent(value: PIXI.Point) {
		this.xinput.updateContent(value.x);
		this.yinput.updateContent(value.y);
	}
}

customElements.define(PointPropertyEditor.tagName, PointPropertyEditor);
