export type InspectableTypes = 'string' | 'number' | 'boolean' | 'point' | 'default';

export interface InspectorPropertyModel {
	name: string;
	typeHint: InspectableTypes;
	data?: any;
	label?: string;
}

export class InspectorData {
	private readonly editors: Partial<Record<InspectableTypes, string>> = {};

	public addEditors(editors: Partial<Record<InspectableTypes, string>>) {
		Object.keys(editors).forEach(e => this.editors[e] = editors[e]);
	}

	public readonly inspectableProperties: InspectorPropertyModel[] = [];

	public addInspectableProperties(properties: InspectorPropertyModel[]) {
		const iproperties = this.inspectableProperties;
		properties.forEach(prop => {
			const i = iproperties.findIndex(e => e.name === prop.name);
			if (i < 0) iproperties.push(prop);
			else iproperties.splice(i, 1, prop);
		});
	}

	public findEditorFor(value: any, data: InspectorPropertyModel) {
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
