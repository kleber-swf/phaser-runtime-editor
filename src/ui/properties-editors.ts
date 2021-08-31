import { BooleanPropertyEditor } from './properties/editors/boolean/boolean-property-editor';
import { NumberPropertyEditor } from './properties/editors/number/number-property-editor';
import { StringPropertyEditor } from './properties/editors/string/string-property-editor';

export interface PropertyInspectionData {
	name: string;
	typeHint: string;
	data?: any;
}

// TODO this name is awful. Please find a better one
class PropertiesEditorsClass {
	private readonly editors = {
		// type
		string: StringPropertyEditor.tagName,
		number: NumberPropertyEditor.tagName,
		boolean: BooleanPropertyEditor.tagName,

		// default
		default: StringPropertyEditor.tagName,
	};

	public readonly inspectableProperties: PropertyInspectionData[] = [
		{ name: 'name', typeHint: 'string' },
		{ name: 'alpha', typeHint: 'number', data: { min: 0, max: 1, step: 0.1 } },
		{ name: 'visible', typeHint: 'boolean' },
	];

	public findEditorFor(value: any, data: PropertyInspectionData) {
		// TODO what abount null / undefined values?

		const editors = this.editors;

		// TODO this should never fail
		// first, it tries to find based on the type hint
		if (data.typeHint in editors) return editors[data.typeHint];


		// next, it tries to find by its type
		const type = typeof value;
		if (type !== 'object' && type in editors)
			return editors[type];

		// next, since it's an object, it tries to find by its contructor name
		const ctor = value.contructor?.name;
		if (ctor && ctor in editors) return editors[ctor];

		return editors.default;
	}

}

export const PropertiesEditors = new PropertiesEditorsClass();