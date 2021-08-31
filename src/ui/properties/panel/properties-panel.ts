import { PropertiesEditors, PropertyInspectionData } from 'ui/properties-editors';
import { Widget } from 'ui/widget/widget';
import { PropertyEditor } from '../editors/property-editor';
import './properties-panel.scss';

export class PropertiesPanel extends Widget {
	public static readonly tagName: string = 'phed-properties-panel';

	private content: HTMLElement;

	public connectedCallback() {
		super.connectedCallback();

		const title = document.createElement('div');
		title.classList.add('title');
		this.appendChild(title);
		title.append('PROPERTIES');

		const content = this.content = document.createElement('div');
		content.classList.add('content');
		this.appendChild(content);
	}

	private createPropertyRow(prop: PropertyInspectionData, value: any, tagName: string) {
		const row = document.createElement(tagName) as PropertyEditor<any>;
		row.setContent(prop, value);
		this.content.appendChild(row);
	}

	public selectObject(obj: PIXI.DisplayObject) {
		const emptyContent = this.content.cloneNode(false);
		this.replaceChild(emptyContent, this.content);
		this.content = emptyContent as HTMLElement;

		if (!obj) {
			this.content.style.visibility = 'hidden';
			return;
		}
		this.content.style.visibility = 'visible';
		console.log(obj);

		// TODO move this array to a proper place
		// TODO they could have a type hint
		PropertiesEditors.inspectableProperties
			.forEach(prop => {
				if (!(prop.name in obj)) return;
				const elementId = PropertiesEditors.findEditorFor(obj[prop.name], prop);
				this.createPropertyRow(prop, obj[prop.name], elementId);
			});
	}
}

customElements.define(PropertiesPanel.tagName, PropertiesPanel);