import './popup.scss';

export class Popup extends HTMLElement {
	public static readonly tagName = 'phred-popup';

	public content: HTMLElement;
	public header: HTMLElement;

	public init(title: string) {
		this.header = this.appendChild(document.createElement('h1'));
		this.header.innerText = title;

		this.content = this.appendChild(document.createElement('div'));
		this.content.classList.add('content');
	}
}

customElements.define(Popup.tagName, Popup);
