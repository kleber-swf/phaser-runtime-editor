import { Widget } from 'ui/widget/widget';
import './properties-panel.scss';

export class PropertiesPanel extends Widget {
	public static readonly tagId = 'phed-properties-panel';

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

	private createPropertyRow(name: string, value: any) {
		const propId = `prop-value-${name}`;

		const prop = document.createElement('div');
		prop.classList.add('property-editor');
		this.content.appendChild(prop);

		const propTitle = document.createElement('label');
		propTitle.classList.add('property-title');
		propTitle.append(name);
		propTitle.setAttribute('for', propId);
		prop.append(propTitle);

		const propContent = document.createElement('div');
		propContent.classList.add('property-content');
		prop.append(propContent);

		// TODO make this specific for each type of property
		const propValue = document.createElement('input');
		propValue.id = propId;
		propValue.setAttribute('type', 'text');
		propValue.setAttribute('value', value);
		propContent.append(propValue);
	}

	public selectObject(obj: PIXI.DisplayObject) {
		const emptyContent = this.content.cloneNode(false);
		this.replaceChild(emptyContent, this.content);
		this.content = emptyContent as HTMLElement;
		
		if (!obj) return;
		['name', 'scale'].forEach(prop => {
			if (prop in obj) this.createPropertyRow(prop, obj[prop]);
		});
	}
}

customElements.define(PropertiesPanel.tagId, PropertiesPanel);