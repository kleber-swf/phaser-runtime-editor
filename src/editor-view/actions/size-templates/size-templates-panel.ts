import './size-templates-panel.scss';

const OPTIONS = [
	{ label: 'custom' },
	{ width: 800, height: 450, label: '16:9' },
	{ width: 800, height: 500, label: '16:10' },
	{ width: 780, height: 520, label: '19.5:9' },
	{ width: 800, height: 600, label: '4:3' },
	{ width: 900, height: 600, label: '3:2' },
];

// 16:9		0.5625		800 450
// 16:10		0.625			800 500
// 19.5:9	0.4615		780 520
// 3:2		0.66667		900 600
// 4:3		0.75			800 600

export class SizeTemplatesPanel extends HTMLElement {
	public static readonly tagName = 'phred-size-templates-panel';

	public init() {
		const selectedTemplate = this.appendChild(document.createElement('div'));
		selectedTemplate.classList.add('selected-template');

		const e = this.appendChild(document.createElement('select')) as HTMLSelectElement;
		OPTIONS.forEach((value, index) => {
			const o = e.appendChild(document.createElement('option'));
			o.value = index.toString();
			o.innerHTML = value.label;
		});

		const btn = this.appendChild(document.createElement('div'));
		btn.classList.add('button');
		btn.appendChild(document.createElement('i')).classList.add('fas', 'fa-caret-down');
	}
}

customElements.define(SizeTemplatesPanel.tagName, SizeTemplatesPanel);
