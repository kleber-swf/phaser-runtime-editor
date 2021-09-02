import { Action } from 'index';
import './action-button.scss';

export class ActionButton extends HTMLElement {
	public static readonly tagName: string = 'phed-action-button';

	public connectedCallback() { }

	public setAction(action: Action) {
		if (action.icon) {
			const icon = this.appendChild(document.createElement('i'));
			icon.classList.add('fas', action.icon);
			// TODO tooltip
		} else {
			const text = this.appendChild(document.createElement('span'));
			text.classList.add('label');
			text.textContent = action.label;
		}
		this.onclick = () => action.command();
	}
}

customElements.define(ActionButton.tagName, ActionButton);
