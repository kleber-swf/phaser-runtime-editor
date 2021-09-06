import './disabled-ui.scss';

export class DisabledUI {
	private readonly button: HTMLElement;
	public get onclick() { return this.button.onclick; }
	public set onclick(value: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null) { this.button.onclick = value; }

	public constructor() {
		const btn = document.body.appendChild(document.createElement('div'));
		btn.classList.add('button', 'edit-button');
		this.button = btn;

		const label = btn.appendChild(document.createElement('span'));
		label.classList.add('label');
		label.textContent = 'EDIT';
	}
}
