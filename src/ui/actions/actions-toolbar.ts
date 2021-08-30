import { Widget } from 'ui/widget/widget';
import './actions-toolbar.scss'

export class ActionsToolbar extends Widget {
	public static readonly tagName: string = 'phred-actions-toolbar';
}

customElements.define(ActionsToolbar.tagName, ActionsToolbar);
