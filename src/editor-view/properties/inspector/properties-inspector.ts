import { ComponentTags } from 'component-tags';
import { Editor } from 'core/editor';
import { DataOrigin } from 'data/editor-data';
import { InspectorPropertyModel } from 'data/inspector-data';
import { Inspector } from 'editor-view/inspector/inspector';
import { PluginConfig } from 'plugin';
import { PropertyEditor } from '../editors/property-editor';

export class PropertiesInspector extends Inspector {
	private editors: Record<string, PropertyEditor<any>> = {};

	public init(game: Phaser.Game, config: PluginConfig) {
		super.init(game, config);
		this.title = 'Properties';
		Editor.data.onPropertyChanged.add(this.onPropertyChanged, this);
	}

	private onPropertyChanged(origin: DataOrigin, property: string, value: any) {
		if (origin !== DataOrigin.INSPECTOR)
			this.editors[property]?.propertyChangedOutsideInspector(value);
	}

	private createPropertyEditor(prop: InspectorPropertyModel, value: any, tagName: string) {
		const editor = this.contentElement.appendChild(document.createElement(tagName)) as PropertyEditor<any>;
		editor.setContent(prop, value, true);
		return editor;
	}

	private createTitleElement(title: string) {
		const header = this.contentElement.appendChild(document.createElement('h2'));
		const el = header.appendChild(document.createElement('div'));
		el.classList.add('title');
		el.textContent = title;
	}

	private createDivider() {
		this.contentElement.appendChild(document.createElement('hr'));
	}

	public selectObject(obj: PIXI.DisplayObject) {
		// TODO what happen with the instances? Are they garbage collected?
		const emptyContent = this.contentElement.cloneNode(false);
		this.replaceChild(emptyContent, this.contentElement);
		this.contentElement = emptyContent as HTMLElement;
		this.editors = {};

		if (!obj) {
			this.contentElement.style.visibility = 'hidden';
			return;
		}

		this.contentElement.style.visibility = 'visible';

		const idata = Editor.inspectorData;
		const propertyGroups = idata.getObjectPropertiesForType(obj.__baseType)
		propertyGroups.forEach(group => {
			if (group.title) this.createTitleElement(group.title);
			group.properties.forEach(prop => {
				if (prop !== 'divider')
					this.createEditorForProperty(obj, idata.getInspectableProperty(prop));
				else
					this.createDivider();
			});
		})
	}

	private createEditorForProperty(obj: PIXI.DisplayObject, prop: InspectorPropertyModel) {
		if (!(prop.name in obj)) return;
		const elementId = Editor.inspectorData.getEditorForType(prop.typeHint);
		const editor = this.createPropertyEditor(prop, obj[prop.name], elementId);
		this.editors[prop.name] = editor;
	}
}

customElements.define(ComponentTags.PropertiesInspector, PropertiesInspector);
