import './widget.scss';

export abstract class Widget extends HTMLElement {
	public connectedCallback() {
		this.classList.add('phred-widget');
	}
}
