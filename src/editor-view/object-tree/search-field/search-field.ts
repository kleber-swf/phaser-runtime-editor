import './search-field.scss';

export class SearchField extends HTMLElement {
	public static readonly tagName: string = 'phred-search-field';

	private value: string;
	private field: HTMLInputElement;

	public onValueChanged: (e: string) => void;

	public connectedCallback() {
		const field = this.field = this.appendChild(document.createElement('input'));
		field.type = 'text';
		field.oninput = this.onFieldChanged.bind(this);

		const clear = this.appendChild(document.createElement('div'));
		clear.classList.add('clear-button');
		clear.onclick = this.clearField.bind(this);
	}

	private clearField() {
		this.field.value = '';
		this.field.dispatchEvent(new InputEvent('input'));
		this.field.focus();
	}

	private onFieldChanged() {
		if (this.value === this.field.value) return;
		this.value = this.field.value;
		this.onValueChanged(this.value);
	}
}

customElements.define(SearchField.tagName, SearchField);
