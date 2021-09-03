import { Actions } from 'data/actions';
import { Widget } from 'editor/widget/widget';
import './actions-toolbar.scss';
import { ActionButton } from './button/action-button';

export class ActionsToolbar extends Widget {
	public static readonly tagName: string = 'phred-actions-toolbar';

	public connectedCallback() {
		super.connectedCallback();
		this.createButton('TOGGLE_SNAP');
		this.createButton('UNDO');
	}

	private createButton(actionId: string) {
		const btn = document.createElement(ActionButton.tagName) as ActionButton;
		btn.setAction(Actions.getAction(actionId));
		this.appendChild(btn);
	}
}

customElements.define(ActionsToolbar.tagName, ActionsToolbar);
