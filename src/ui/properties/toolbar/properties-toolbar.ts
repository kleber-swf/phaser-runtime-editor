import { Widget } from '../../widget';
import { PropertiesPanel } from '../panel/properties-panel';
import './properties-toolbar.scss'

export class PropertiesToolbar extends Widget {
	public static readonly tagId = 'phred-properties-toolbar';

	public connectedCallback() {
		super.connectedCallback();
		const panel = document.createElement(PropertiesPanel.tagId);
		this.appendChild(panel);
	}
}

customElements.define(PropertiesToolbar.tagId, PropertiesToolbar);