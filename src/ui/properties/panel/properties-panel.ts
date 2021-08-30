import { Widget } from 'ui/widget/widget';
import './properties-panel.scss';

export class PropertiesPanel extends Widget {
	public static readonly tagId = 'phed-properties-panel';

	public connectedCallback() {
		super.connectedCallback();
		
		const title = document.createElement('div');
		title.classList.add('title');
		this.appendChild(title);
		title.append('PROPERTIES');

		const content = document.createElement('div');
		content.classList.add('content');
		this.appendChild(content);
	}
}

customElements.define(PropertiesPanel.tagId, PropertiesPanel);