import { Widget } from './widget';

export class PropertiesPanel extends Widget {
	public static readonly tagId = 'phed-properties-panel';
}

customElements.define(PropertiesPanel.tagId, PropertiesPanel);