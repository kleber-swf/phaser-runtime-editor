import './size-templates-panel.scss';

const OPTIONS = [
	{ label: 'custom' },
	{ width: 800, height: 450, label: '16:9' },
	{ width: 800, height: 500, label: '16:10' },
	{ width: 780, height: 520, label: '19.5:9' },
	{ width: 800, height: 600, label: '4:3' },
	{ width: 900, height: 600, label: '3:2' },
];

export class SizeTemplatesPanel extends HTMLElement {
	public static readonly tagName = 'phred-size-templates-panel';

	public set interactable(value: boolean) {
		if (value) {
			this.classList.remove('disabled');
			return;
		}
		if (!this.classList.contains('disabled')) {
			this.classList.add('disabled');
		}
	}

	public init() {
		this.classList.add('fa');
		const e = this.appendChild(document.createElement('select')) as HTMLSelectElement;
		e.classList.add('button');

		OPTIONS.forEach((value, index) => {
			const option = document.createElement('option');
			option.value = index.toString();
			option.innerHTML = value.label;
			e.appendChild(option);
		});
	}
}

customElements.define(SizeTemplatesPanel.tagName, SizeTemplatesPanel);
