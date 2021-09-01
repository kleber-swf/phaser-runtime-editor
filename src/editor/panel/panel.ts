import { Inspector } from 'editor/inspector/inspector';
import { Widget } from 'editor/widget/widget';
import './panel.scss';

export class Panel extends Widget {
	public static readonly tagName: string = 'phred-panel';
	private readonly inspectors: Inspector[] = [];	// TODO depend on an interface or abstract class here

	public addInspector(inspector: Inspector) {
		this.appendChild(inspector);
		this.inspectors.push(inspector);
	}

	public selectObject(obj: PIXI.DisplayObject) {
		this.inspectors.forEach(p => p.selectObject(obj));
	}
}

customElements.define(Panel.tagName, Panel);