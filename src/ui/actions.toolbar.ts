import { Widget } from './widget';

export class ActionsToolbar extends Widget {
	public static eid = 'phred-actions-toolbar';
}

customElements.define(ActionsToolbar.eid, ActionsToolbar);
