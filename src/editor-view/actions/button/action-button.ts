import { Action } from 'index';
import './action-button.scss';

export class ActionButton extends HTMLElement {
	public static readonly tagName: string = 'phed-action-button';
	private action: Action;

	public setAction(action: Action) {
		this.classList.add('button');
		this.action = action;
		if (action.icon) {
			const icon = this.appendChild(document.createElement('i'));
			icon.classList.add('fas', action.icon);
			// TODO tooltip
		} else {
			const text = this.appendChild(document.createElement('span'));
			text.classList.add('label');
			text.textContent = action.label;
		}
		if (!action.toggle) {
			this.onclick = () => action.command();
			return;
		}
		this.onclick = this.toggleSelected.bind(this);
		this.updateState();
	}

	private toggleSelected() {
		this.action.command();
		this.updateState();
	}

	private updateState() {
		if (this.action.state()) this.classList.add('selected');
		else this.classList.remove('selected');
	}
}

customElements.define(ActionButton.tagName, ActionButton);
