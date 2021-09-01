import { BooleanPropertyEditor } from './properties/editors/boolean/boolean-property-editor';
import { NumberPropertyEditor } from './properties/editors/number/number-property-editor';
import { PointPropertyEditor } from './properties/editors/point/point-property-editor';
import { StringPropertyEditor } from './properties/editors/string/string-property-editor';

export type InspectableTypes = 'string' | 'number' | 'boolean' | 'point' | 'default';

export interface PropertyInspectionData {
	name: string;
	typeHint: InspectableTypes;
	data?: any;
}


// TODO this name is awful. Please find a better one
class PropertiesEditorsClass {
	private readonly editors: Record<InspectableTypes, string> = {
		// basic types
		string: StringPropertyEditor.tagName,
		number: NumberPropertyEditor.tagName,
		boolean: BooleanPropertyEditor.tagName,

		// PIXI/Phaser types
		point: PointPropertyEditor.tagName,

		// default
		default: StringPropertyEditor.tagName,
	};

	public readonly inspectableProperties: PropertyInspectionData[] = [
		{ name: '__type', typeHint: 'string', data: { readonly: true } },
		{ name: 'name', typeHint: 'string' },
		{ name: 'position', typeHint: 'point' },
		{ name: 'scale', typeHint: 'point', data: { step: 0.1 } },
		{ name: 'pivot', typeHint: 'point' },
		{ name: 'anchor', typeHint: 'point', data: { step: 0.1 } },
		{ name: 'alpha', typeHint: 'number', data: { min: 0, max: 1, step: 0.1 } },
		{ name: 'visible', typeHint: 'boolean' },
		{ name: 'angle', typeHint: 'number', data: { readonly: true } },
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