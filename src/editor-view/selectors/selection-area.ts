import './selection-area.scss';
import { NewSelection } from './selection/selection';

export class SelectionArea extends HTMLElement {
	selection: NewSelection;

	connectedCallback() {
		this.selection = document.createElement('phred-selection') as NewSelection;
		this.appendChild(this.selection);
	}
}

customElements.define('phred-selection-area', SelectionArea);
