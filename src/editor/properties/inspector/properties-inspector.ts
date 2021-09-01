import { Data, DataOrigin } from 'data/data';
import { Inspector } from 'editor/inspector/inspector';
import { PropertiesEditors, PropertyInspectionData } from 'editor/properties-editors';
import { PropertyEditor } from '../editors/property-editor';
import './properties-inspector.scss';

export class PropertiesInspector extends Inspector {
	public static readonly tagName: string = 'phed-properties-inspector';
	private editors: Record<string, PropertyEditor<any>> = {};

	public connectedCallback() {
		super.connectedCallback();
		this.title = 'Properties';
		Data.addPropertyChangedListener(DataOrigin.SCENE, this.onPropertyChangedInsideEditor.bind(this));
	}

	private onPropertyChangedInsideEditor(property: string, value: any) {
		this.editors[property]?.updateContent(value);
	}

	private createPropertyEditor(prop: PropertyInspectionData, value: any, tagName: string) {
		const editor = document.createElement(tagName) as PropertyEditor<any>;
		editor.setContent(prop, value);
		this.content.appendChild(editor);
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

		PropertiesEditors.inspectableProperties
			.forEach(prop => {
				if (!(prop.name in obj)) return;
				const elementId = PropertiesEditors.findEditorFor(obj[prop.name], prop);
				const editor = this.createPropertyEditor(prop, obj[prop.name], elementId);
				this.editors[prop.name] = editor;
			});
	}
}

customElements.define(PropertiesInspector.tagName, PropertiesInspector);