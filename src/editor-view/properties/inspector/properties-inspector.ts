import { Editor } from 'core/editor';
import { DataOrigin } from 'data/editor-data';
import { InspectorPropertyModel } from 'data/inspector-data';
import { Inspector } from 'editor-view/inspector/inspector';
import { PropertyEditor } from '../editors/property-editor';
import './properties-inspector.scss';

export class PropertiesInspector extends Inspector {
	public static readonly tagName: string = 'phed-properties-inspector';
	private editors: Record<string, PropertyEditor<any>> = {};

	public init(game: Phaser.Game, root: Container) {
		super.init(game, root);
		this.title = 'Properties';
		Editor.data.onPropertyChanged.add(this.onPropertyChanged, this);
	}

	private onPropertyChanged(origin: DataOrigin, property: string, value: any) {
		if (origin !== DataOrigin.INSPECTOR)
			this.editors[property]?.propertyChangedOutsideInspector(value);
	}

	private createPropertyEditor(prop: InspectorPropertyModel, value: any, tagName: string) {
		const editor = this.content.appendChild(document.createElement(tagName)) as PropertyEditor<any>;
		editor.setContent(prop, value, true);
		return editor;
	}

	public selectObject(obj: PIXI.DisplayObject) {
		// TODO what happen with the instances? Are they garbage collected?
		const emptyContent = this.content.cloneNode(false);
		this.replaceChild(emptyContent, this.content);
		this.content = emptyContent as HTMLElement;
		this.editors = {};

		if (!obj) {
			this.content.style.visibility = 'hidden';
			return;
		}

		this.content.style.visibility = 'visible';

		Editor.inspectorData.inspectableProperties
			.forEach(prop => this.createEditorForProperty(obj, prop));
	}

	private createEditorForProperty(obj: PIXI.DisplayObject, prop: InspectorPropertyModel) {
		if (!(prop.name in obj)) return;
		const elementId = Editor.inspectorData.findEditorFor(prop);
		const editor = this.createPropertyEditor(prop, obj[prop.name], elementId);
		this.editors[prop.name] = editor;
	}
}

customElements.define(PropertiesInspector.tagName, PropertiesInspector);