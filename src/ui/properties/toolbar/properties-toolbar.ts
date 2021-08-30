import { Widget } from 'ui/widget/widget';
import { PropertiesPanel } from '../panel/properties-panel';
import './properties-toolbar.scss';

export class PropertiesToolbar extends Widget {
	public static readonly tagName = 'phred-properties-toolbar';
	private readonly panels: PropertiesPanel[] = [];	// TODO depend on an interface or abstract class here

	public connectedCallback() {
		super.connectedCallback();
		const panel = document.createElement(PropertiesPanel.tagName) as PropertiesPanel;
		this.appendChild(panel);
		this.panels.push(panel);
	}

	public selectObject(obj: PIXI.DisplayObject) {
		this.panels.forEach(p => p.selectObject(obj));
	}
}

customElements.define(PropertiesToolbar.tagName, PropertiesToolbar);