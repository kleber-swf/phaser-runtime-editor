export class PropertiesToolbar extends HTMLDivElement {
	public static eid = 'phred-properties-toolbar';

	constructor() {
		super();
		this.classList.add(PropertiesToolbar.eid);
	}
}

customElements.define(PropertiesToolbar.eid, PropertiesToolbar, { extends: 'div' });