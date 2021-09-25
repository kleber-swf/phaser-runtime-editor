import { ComponentTags } from 'component-tags';
import { Actions } from 'core/actions';
import { Editor } from 'core/editor';
import { Widget } from 'editor-view/widget/widget';
import './actions-toolbar.scss';
import { ActionButton } from './button/action-button';

export class ActionsToolbar extends Widget {
	public init() {
		this.createButton(Actions.TOGGLE_ENABLED);
		this.createSeparator();
		this.createButton(Actions.TOGGLE_SNAP);
		this.createButton(Actions.TOGGLE_GUIDES);
		this.createButton(Actions.TOGGLE_GIZMOS);
		this.createSeparator();
		this.createButton(Actions.PRINT_OBJECT);
		this.createSeparator();
		this.createButton(Actions.UNDO);
		this.createSeparator();
		this.createSpacer();
	}

	public enable() { }
	public disable() { }

	private createButton(actionId: string) {
		const action = Editor.actions.getAction(actionId);
		if (!action) return;
		const btn = document.createElement(ComponentTags.ActionButton) as ActionButton;
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

customElements.define(ComponentTags.ActionsToolbar, ActionsToolbar);
