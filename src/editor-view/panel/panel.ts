import { Inspector } from 'editor-view/inspector/inspector';
import { Widget } from 'editor-view/widget/widget';
import './panel.scss';

export class Panel extends Widget {
	public static readonly tagName: string = 'phred-panel';
	private readonly inspectors: Inspector[] = [];

	public addInspector(inspector: Inspector) {
		this.appendChild(inspector);
		this.inspectors.push(inspector);
	}

	public selectObject(obj: PIXI.DisplayObject) {
		this.inspectors.forEach(p => p.selectObject(obj));
	}

	public init(game: Phaser.Game, root: Container) {
		this.inspectors.forEach(inspector => inspector.init(game, root));
	}

	public enable() {
		this.inspectors.forEach(inspector => inspector.enable());
	}

	public disable() {
		this.inspectors.forEach(inspector => inspector.disable());
	}
}

customElements.define(Panel.tagName, Panel);