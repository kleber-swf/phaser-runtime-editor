import { StringPropertyEditor } from './properties/editors/string/string-property-editor';

class PropertiesEditorsClass {
	private readonly editors = {
		string: StringPropertyEditor.tagName,
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