import { Widget } from './widget';

export class ActionsToolbar extends Widget {
	public static readonly tagId = 'phred-actions-toolbar';
}

customElements.define(ActionsToolbar.tagId, ActionsToolbar);
