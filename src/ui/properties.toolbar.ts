import { PropertiesPanel } from './properties.panel';
import { Widget } from './widget';

export class PropertiesToolbar extends Widget {
	public static readonly tagId = 'phred-properties-toolbar';

	public connectedCallback() {
		super.connectedCallback();
		const panel = document.createElement(PropertiesPanel.tagId);
		this.appendChild(panel);
	}
}

customElements.define(PropertiesToolbar.tagId, PropertiesToolbar);