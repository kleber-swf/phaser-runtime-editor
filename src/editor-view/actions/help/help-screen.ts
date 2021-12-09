import { Action } from 'core/action-handler';
import { Editor } from 'core/editor';
import './help-screen.scss';

export class HelpScreen extends HTMLElement {
	public static readonly tagName = 'phred-help-screen';

	public connectedCallback() {
		const popup = this.createPopup();
		const content = popup.appendChild(document.createElement('div'));
		content.classList.add('content');

		let lastCategory: string;
		let group: HTMLElement;

		Object.values(Editor.actions.getActions())
			.filter(a => a.tooltip || a.description)
			.sort((a, b) => a.category.localeCompare(b.category))
			.forEach(a => {
				if (a.category !== lastCategory) {
					lastCategory = a.category;
					group = this.createCategoryGroup(lastCategory, content);
				}
				this.createLine(a, group);
			});

		this.addEventListener('click', () => this.remove());
	}

	private createPopup() {
		const popup = document.createElement('div');
		popup.classList.add('popup');

		popup.appendChild(document.createElement('h1'))
			.innerText = 'Help';

		this.appendChild(popup);
		return popup;
	}

	private createCategoryGroup(name: string, parent: HTMLElement) {
		const group = document.createElement('div');
		group.classList.add('category-group');

		group.appendChild(document.createElement('h2'))
			.innerText = name;

		parent.appendChild(group);
		return group;
	}

	private createLine(action: Action, parent: HTMLElement) {
		const el = document.createElement('div');
		el.classList.add('action');

		const icon = el.appendChild(document.createElement('div'));
		icon.classList.add('icon', 'i', 'fas', action.icon);

		const shortcut = el.appendChild(document.createElement('label'));
		shortcut.classList.add('shortcut');
		if (action.shortcuts?.length) {
			shortcut.innerHTML = action.shortcuts
				.map(s => `<span>${this.humanReadableShortcut(s)}</span>`)
				.join('');
			// shortcut.innerText = this.humanReadableShortcut(action.shortcuts[0]);
		}

		const label = el.appendChild(document.createElement('label'));
		label.classList.add('description');
		label.innerText = action.description ?? action.tooltip;

		parent.appendChild(el);
	}

	private humanReadableShortcut(shortcut: string) {
		return shortcut
			.replace('+Shift', '')
			.replace('ArrowUp', '⬆')
			.replace('ArrowDown', '⬇')
			.replace('ArrowLeft', '⬅')
			.replace('ArrowRight', '➡');
	}
}

customElements.define(HelpScreen.tagName, HelpScreen);
