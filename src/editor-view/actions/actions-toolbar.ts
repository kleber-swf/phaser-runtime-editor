import { Widget } from 'editor-view/widget/widget';
import { Editor } from 'core/editor';
import './actions-toolbar.scss';
import { ActionButton } from './button/action-button';
import { Actions } from 'actions';

export class ActionsToolbar extends Widget {
	public static readonly tagName: string = 'phred-actions-toolbar';

	public connectedCallback() {
		super.connectedCallback();
		this.createButton(Actions.TOGGLE_SNAP);
		this.createButton(Actions.UNDO);
		this.createButton(Actions.TOGGLE_REF_IMAGE);
	}

	private createButton(actionId: string) {
		const action = Editor.actions.getAction(actionId);
		if (!action) return;
		const btn = document.createElement(ActionButton.tagName) as ActionButton;
		btn.setAction(action);
		this.appendChild(btn);
	}
}

customElements.define(ActionsToolbar.tagName, ActionsToolbar);
