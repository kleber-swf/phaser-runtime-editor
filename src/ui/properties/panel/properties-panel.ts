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

		const prop = document.createElement('div');
		prop.classList.add('property-editor');
		content.appendChild(prop);

		const propTitle = document.createElement('label');
		propTitle.classList.add('property-title');
		propTitle.append('name');
		propTitle.setAttribute('for', 'prop-value')
		prop.append(propTitle);

		const propContent = document.createElement('div');
		propContent.classList.add('property-content');
		prop.append(propContent);

		const propValue = document.createElement('input');
		propValue.id = 'prop-value';
		propValue.setAttribute('type', 'text');
		propValue.setAttribute('value', 'Object name');
		propContent.append(propValue);
	}

	public selectObject(obj: PIXI.DisplayObject) {

	}
}

customElements.define(PropertiesPanel.tagId, PropertiesPanel);