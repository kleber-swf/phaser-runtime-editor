import { NumberPropertyEditor } from './number-property-editor';

export class AlphaPropertyEditor extends NumberPropertyEditor {
	public static readonly tagName: string = 'phed-alpha-property-editor';

	protected createInnerContent(value: number, propertyId: string) {
		const el = super.createInnerContent(value, propertyId);
		el.setAttribute('min', '0');
		el.setAttribute('max', '1');
		el.setAttribute('step', '0.1');
		return el;
	}
}

customElements.define(AlphaPropertyEditor.tagName, AlphaPropertyEditor);
