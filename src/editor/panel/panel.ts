import { Inspector } from 'editor/inspector/inspector';
import { Widget } from 'editor/widget/widget';
import { PropertiesInspector } from '../properties/inspector/properties-inspector';
import './panel.scss';

export class Panel extends Widget {
	public static readonly tagName: string = 'phred-panel';
	private readonly inspectors: Inspector[] = [];	// TODO depend on an interface or abstract class here

	// public connectedCallback() {
	// 	super.connectedCallback();
	// 	const panel = document.createElement(PropertiesInspector.tagName) as PropertiesInspector;
	// 	this.appendChild(panel);
	// 	this.panels.push(panel);
	// }

	public addInspector(inspector: Inspector) {
		this.appendChild(inspector);
		this.inspectors.push(inspector);
	}

	public selectObject(obj: PIXI.DisplayObject) {
		this.inspectors.forEach(p => p.selectObject(obj));
	}
}

customElements.define(Panel.tagName, Panel);