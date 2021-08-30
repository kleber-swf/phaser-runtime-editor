import { Widget } from 'ui/widget/widget';
import './properties-panel.scss';

export class PropertiesPanel extends Widget {
	public static readonly tagId = 'phed-properties-panel';

	public connectedCallback() {
		super.connectedCallback();
		const title = document.createElement('div');
		this.appendChild(title);
		title.append('TITLE')
	}
}

customElements.define(PropertiesPanel.tagId, PropertiesPanel);