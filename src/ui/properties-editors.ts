import { BooleanPropertyEditor } from './properties/editors/boolean/boolean-property-editor';
import { AlphaPropertyEditor } from './properties/editors/number/alpha-property-editor';
import { NumberPropertyEditor } from './properties/editors/number/number-property-editor';
import { StringPropertyEditor } from './properties/editors/string/string-property-editor';

// TODO this name is awful. Please find a better one
class PropertiesEditorsClass {
	private readonly editors = {
		// type
		string: StringPropertyEditor.tagName,
		number: NumberPropertyEditor.tagName,
		boolean: BooleanPropertyEditor.tagName,

		// name
		alpha: AlphaPropertyEditor.tagName,
		
		// default
		default: StringPropertyEditor.tagName,
	};

	public findEditorFor(name: string, value: any) {
		// TODO what abount null / undefined values?

		const editors = this.editors;
		// first, try to find by the name of the property
		if (name in editors) return editors[name];

		// second, try to find by its type
		const type = typeof value;
		if (type !== 'object' && type in editors)
			return editors[type];

		// next, since it's an object, try to find by its contructor name
		const ctor = value.contructor?.name;
		if (ctor && ctor in editors) return editors[ctor];

		return editors.default;
	}
}

export const PropertiesEditors = new PropertiesEditorsClass();