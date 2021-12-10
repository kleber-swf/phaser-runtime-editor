import { Editor } from 'core/editor';
import { Preferences } from 'core/preferences/preferences';
import { Size } from 'plugin.model';
import './size-templates-panel.scss';

const OPTIONS = [
	{ label: 'custom' },
	{ width: 800, height: 450, label: '16:9' },
	{ width: 800, height: 500, label: '16:10' },
	{ width: 780, height: 360, label: '19.5:9' },
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
		const el = this.appendChild(document.createElement('select')) as HTMLSelectElement;
		el.classList.add('button');

		OPTIONS.forEach((value, index) => {
			const option = document.createElement('option');
			option.value = index.toString();
			option.innerHTML = value.label;
			el.appendChild(option);
		});

		el.value = (Editor.prefs.get('responsiveSizeTemplateIndex') ?? 0).toString();
		el.addEventListener('change', this.onValueChanged.bind(this));
	}

	private onValueChanged(e: Event) {
		const index = parseInt((e.target as HTMLOptionElement).value, 10);
		if (isNaN(index) || index < 0 || index >= OPTIONS.length) return;
		const option = OPTIONS[index];
		this.setResponsiveSizeTemplate(index, option.width, option.height);
	}

	public setResponsiveSizeTemplate(index: number, width: number, height: number) {
		const prefs = Editor.prefs;

		const currentSize = prefs.get('responsiveSize') as Size;

		width = width ?? currentSize.width ?? Preferences.DefaultResponsiveSize.width;
		height = height ?? currentSize.height ?? Preferences.DefaultResponsiveSize.height;

		if (currentSize.height > currentSize.width) {
			const aux = width;
			width = height;
			height = aux;
		}

		prefs.set('responsiveSizeTemplateIndex', index, false);
		prefs.set('responsiveSize', { width, height }, true);
	}
}

customElements.define(SizeTemplatesPanel.tagName, SizeTemplatesPanel);
