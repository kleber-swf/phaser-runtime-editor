export type InspectableTypes = 'string' | 'number' | 'boolean' | 'point' | 'rect' | 'default';

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

	public findEditorFor(data: InspectorPropertyModel) {
		// TODO what abount null / undefined values?
		return (data.typeHint in this.editors)
			? this.editors[data.typeHint]
			: this.editors.default;
	}
}
