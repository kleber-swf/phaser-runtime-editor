import { Widget } from './widget';

export class PropertiesToolbar extends Widget {
	public static eid = 'phred-properties-toolbar';
}

customElements.define(PropertiesToolbar.eid, PropertiesToolbar);