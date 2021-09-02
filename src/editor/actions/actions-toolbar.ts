import { Widget } from 'editor/widget/widget';
import './actions-toolbar.scss'
import { Actions } from 'data/actions'
import { ActionButton } from './button/action-button';

export class ActionsToolbar extends Widget {
	public static readonly tagName: string = 'phred-actions-toolbar';

	public connectedCallback() {
		super.connectedCallback();

		Actions.getActions().forEach(action => {
			const btn = document.createElement(ActionButton.tagName) as ActionButton;
			btn.setAction(action);
			this.appendChild(btn);
		})
	}
}

customElements.define(ActionsToolbar.tagName, ActionsToolbar);
