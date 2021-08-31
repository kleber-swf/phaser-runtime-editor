import { NumberPropertyEditor } from '../number/number-property-editor';
import { PropertyEditor } from '../property-editor';

export class PointPropertyEditor extends PropertyEditor<PIXI.Point> {
	public static readonly tagName: string = 'phed-point-property-editor';

	protected createInnerContent(value: PIXI.Point, propertyId: string) {
		value = value ?? new PIXI.Point(0, 0);

		const parent = document.createElement('div');
		this.appendChild(parent);

		const xinput = document.createElement(NumberPropertyEditor.tagName) as NumberPropertyEditor;
		xinput.setContent({ name: 'x', typeHint: 'number' }, value.x);
		xinput.id = propertyId;
		parent.appendChild(xinput);

		const yinput = document.createElement(NumberPropertyEditor.tagName) as NumberPropertyEditor;
		yinput.setContent({ name: 'y', typeHint: 'number' }, value.y);
		yinput.id = propertyId;
		parent.appendChild(yinput);

		return parent;
	}
}

customElements.define(PointPropertyEditor.tagName, PointPropertyEditor);
