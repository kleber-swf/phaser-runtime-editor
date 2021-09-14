import { Widget } from 'editor-view/widget/widget';
import { Editor } from 'core/editor';
import './actions-toolbar.scss';
import { ActionButton } from './button/action-button';
import { Actions } from 'actions';
import { ReferenceImagePanel } from './reference-image/reference-image-panel';

export class ActionsToolbar extends Widget {
	public static readonly tagName: string = 'phred-actions-toolbar';

	public connectedCallback() {
		super.connectedCallback();
		this.createButton(Actions.TOGGLE_ENABLED);
		this.createSeparator();
		this.createButton(Actions.TOGGLE_SNAP);
		this.createButton(Actions.PRINT_OBJECT);
		this.createSeparator();
		this.createButton(Actions.UNDO);
		this.createSeparator();
		this.createSpacer();

		if (!Editor.referenceImage) return;
		this.createSeparator();
		this.appendChild(document.createElement(ReferenceImagePanel.tagName));
	}

	private createButton(actionId: string) {
		const action = Editor.actions.getAction(actionId);
		if (!action) return;
		const btn = document.createElement(ActionButton.tagName) as ActionButton;
		btn.setAction(action);
		this.appendChild(btn);
	}

	private createSeparator() {
		this.appendChild(document.createElement('div'))
			.classList.add('separator');
	}

	private createSpacer() {
		this.appendChild(document.createElement('div'))
			.classList.add('spacer');
	}
}

customElements.define(ActionsToolbar.tagName, ActionsToolbar);
