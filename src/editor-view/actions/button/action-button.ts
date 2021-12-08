import { Action } from 'core/action-handler';
import { ComponentTags } from 'component-tags';
import './action-button.scss';

export class ActionButton extends HTMLElement {
	private action: Action;

	public setAction(action: Action) {
		this.classList.add('button');
		this.action = action;
		this.createTooltip(action);

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

	private createTooltip(action: Action) {
		const tooltip = this.appendChild(document.createElement('div'));
		tooltip.classList.add('tooltip');
		let text = action.label;
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
		if (this.action.state?.()) this.classList.add('selected');
		else this.classList.remove('selected');
	}
}

customElements.define(ComponentTags.ActionButton, ActionButton);
