import './disabled-ui.scss';

export class DisabledUI {
	public constructor() {
		const btn = document.body.appendChild(document.createElement('div'));
		btn.classList.add('button', 'edit-button');

		const label = btn.appendChild(document.createElement('span'));
		label.classList.add('label');
		label.textContent = 'EDIT';
	}
}
