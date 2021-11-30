import './selection.scss';

export class NewSelection extends HTMLElement {
	connectedCallback() {
		this.classList.add('selector');
	}
}

customElements.define('phred-selection', NewSelection);
