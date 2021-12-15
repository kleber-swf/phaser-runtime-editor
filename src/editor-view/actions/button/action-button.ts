import './action-button.scss';
import { BaseActionButton } from './base.action-button';

export class ActionButton extends BaseActionButton {
	public static readonly tagName = 'phred-action-button';
}

customElements.define(ActionButton.tagName, ActionButton);
