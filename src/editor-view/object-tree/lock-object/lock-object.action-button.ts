import { Action } from 'core/action-handler';
import { Editor } from 'core/editor';
import { BaseActionButton } from 'editor-view/actions/button/base.action-button';
import './lock-object.action-button.scss';

export class LockObjectActionButton extends BaseActionButton {
	public static readonly tagName = 'phred-lock-object-action-button';

	public setAction(action: Action): void {
		super.setAction(action);
		Editor.data.onSelectedObjectChanged.add(this.updateState, this);
	}
}

customElements.define(LockObjectActionButton.tagName, LockObjectActionButton);
