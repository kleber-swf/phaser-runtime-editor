import { PropertyEditor } from '../property-editor';
// import './string-property-editor.scss';

export class StringPropertyEditor extends PropertyEditor<string> {
	public static readonly tagName = 'phed-string-property-editor';

	protected createValue(value: string, propertyId: string) {
		const propContent = document.createElement('div');
		propContent.classList.add('property-content');

		const propValue = document.createElement('input');
		propValue.id = propertyId;
		propValue.setAttribute('type', 'text');
		propValue.setAttribute('value', value ?? '');
		propContent.append(propValue);

		return propContent;
	}
}

customElements.define(StringPropertyEditor.tagName, StringPropertyEditor);
