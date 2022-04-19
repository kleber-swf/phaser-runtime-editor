/* eslint-disable @typescript-eslint/ban-types */
export type InspectableType = 'string' | 'text' | 'number' | 'boolean' | 'point' | 'rect' | 'color' | 'cssColor' | 'valueList' | 'default';

export interface InspectorPropertyModel {
	name: string;
	typeHint: InspectableType;
	values?: { value: any, label: string }[] | any[] | Object;
	data?: any;
	label?: string;
}

export interface ObjectPropertiesModel {
	title: string;
	properties: string[];
}

export class InspectorData {
	/** Editors for each type of data ({@link InspectableType}). */
	private readonly typeEditors: Partial<Record<InspectableType, string>> = {};

	/**
	 * Add editors for {@link InspectableType}.
	 * @param editors A map of editors for each {@link InspectableType}
	 */
	public addTypeEditors(editors: Partial<Record<InspectableType, string>>) {
		Object.keys(editors).forEach(e => this.typeEditors[e] = editors[e]);
	}

	/**
	 * Get the editor for the given {@link InspectableType}
	 * @param type The {@link InspectableType} to get the editor for
	 */
	public getEditorForType(type: InspectableType) {
		return type in this.typeEditors
			? this.typeEditors[type]
			: this.typeEditors.default;
	}

	/** A register of properties from PIXI/Phaser objects that can be inspectable. */
	private readonly inspectableProperties: Record<string, InspectorPropertyModel> = {};

	/**
	 * Adds a list of inspectable properties from PIXI/Phaser objects.
	 * @param properties The list of properties to add.
	 */
	public addInspectableProperties(properties: InspectorPropertyModel[]) {
		properties.forEach(prop => this.inspectableProperties[prop.name] = prop);
	}

	/**
	 * Gets the {@link InspectorPropertyModel} related to the given property name.
	 * @param name The name of the property to get the inspector for.
	 */
	public getInspectableProperty(name: string) {
		if (name in this.inspectableProperties) return this.inspectableProperties[name];
		throw Error(`Could not find inspectable editor for property ${name}`);
	}

	/** Properties that should be inspected when an object of the related type is selected on the editor */
	private readonly objectProperties: Record<string, ObjectPropertiesModel[]> = {};

	/**
	 * Add properties to be shown in the Inspector when an object of the given type is selected on
	 * the editor.
	 * @param type The exact object type name to have the properties
	 * @param properties The properties to show in the Inspector
	 */
	public addObjectProperties(type: string, properties: ObjectPropertiesModel[]) {
		this.objectProperties[type] = properties;
	}

	/**
	 * Gets the properties that should be inspected for the given type.
	 * @param type The type to get the properties for
	 */
	public getObjectPropertiesForType(type: string) {
		return type in this.objectProperties
			? this.objectProperties[type]
			: this.objectProperties.default;
	}
}
