import { Widget } from 'ui/widget/widget';
import './actions-toolbar.scss'

export class ActionsToolbar extends Widget {
	public static readonly tagId = 'phred-actions-toolbar';
}

customElements.define(ActionsToolbar.tagId, ActionsToolbar);
