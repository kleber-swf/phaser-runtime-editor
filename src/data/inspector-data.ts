export type InspectableTypes = 'string' | 'text' | 'number' | 'boolean' | 'point' | 'rect' | 'default';

export interface InspectorPropertyModel {
	name: string;
	typeHint: InspectableTypes;
	data?: any;
	label?: string;
}

export interface ObjectInspectorModel {
	title: string;
	properties: string[];
}


export class InspectorData {
	private readonly editors: Partial<Record<InspectableTypes, string>> = {};

	public addEditors(editors: Partial<Record<InspectableTypes, string>>) {
		Object.keys(editors).forEach(e => this.editors[e] = editors[e]);
	}

	public getEditorFor(data: InspectorPropertyModel) {
		return data.typeHint in this.editors
			? this.editors[data.typeHint]
			: this.editors.default;
	}

	private readonly inspectableProperties: Record<string, InspectorPropertyModel> = {};

	public addInspectableProperties(properties: InspectorPropertyModel[]) {
		properties.forEach(prop => this.inspectableProperties[prop.name] = prop);
	}

	public getInspectableProperty(name: string) {
		if (name in this.inspectableProperties)
			return this.inspectableProperties[name];
		throw `Could not find inspectable editor for property ${name}`;
	}

	private readonly inspectorProperties: Record<string, ObjectInspectorModel[]> = {};

	public addInspectorProperties(type: string, inspectors: ObjectInspectorModel[]) {
		this.inspectorProperties[type] = inspectors;
	}

	public getInspectorPropertiesForType(type: string) {
		return type in this.inspectorProperties
			? this.inspectorProperties[type]
			: this.inspectorProperties.default;
	}
}
