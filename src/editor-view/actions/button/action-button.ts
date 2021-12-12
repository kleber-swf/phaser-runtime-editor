import { Action } from 'core/action-handler';
import { ActionView } from '../action-view';
import './action-button.scss';

export class ActionButton extends HTMLElement implements ActionView {
	public static readonly tagName = 'phred-action-button';

	private action: Action;

	public set interactable(value: boolean) {
		this.classList.addOrRemove('disabled', !value);
	}

	public setAction(action: Action) {
		this.classList.add('button');
		this.action = action;
		this.createTooltip(action);

		if (action.icon) {
			const icon = this.appendChild(document.createElement('i'));
			icon.classList.add('fas', action.icon);
		} else {
			const text = this.appendChild(document.createElement('span'));
			text.classList.add('label');
			text.textContent = action.tooltip;
		}
		if (!action.toggle) {
			this.onclick = () => action.command();
			return;
		}

		this.onclick = this.toggleSelected.bind(this);
		this.updateState();
	}

	private createTooltip(action: Action) {
		if (!action.tooltip) return;
		const tooltip = this.appendChild(document.createElement('div'));
		tooltip.classList.add('tooltip');
		let text = action.tooltip;
		if (action.shortcuts?.length) {
			text += ` (${action.shortcuts[0].replace('+Shift', '')})`;
		}
		tooltip.innerText = text;
	}

	private toggleSelected() {
		this.action.command();
		this.updateState();
	}

	public updateState() {
		this.classList.addOrRemove('selected', this.action.state?.());
	}
}

customElements.define(ActionButton.tagName, ActionButton);
