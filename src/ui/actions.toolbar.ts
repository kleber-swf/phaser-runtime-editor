export class ActionsToolbar extends HTMLDivElement {
	public static eid = 'phred-actions-toolbar';

	constructor() {
		super();
		this.classList.add(ActionsToolbar.eid);
	}
}

customElements.define(ActionsToolbar.eid, ActionsToolbar, { extends: 'div' });
