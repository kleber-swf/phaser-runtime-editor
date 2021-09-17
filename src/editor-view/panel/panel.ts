import { Editor } from 'core/editor';
import { DataOrigin } from 'data/editor-data';
import { Inspector } from 'editor-view/inspector/inspector';
import { Widget } from 'editor-view/widget/widget';
import { PanelSide } from 'types';
import './panel.scss';
import { ResizeHandle } from './resize-handle/resize-handle';

export class Panel extends Widget {
	public static readonly tagName: string = 'phred-panel';
	private readonly inspectors: Inspector[] = [];
	private side: PanelSide;

	public setSide(value: PanelSide) {
		this.side = value;
		this.classList.add(value);
	}

	public addInspector(inspector: Inspector) {
		this.appendChild(inspector);
		this.inspectors.push(inspector);
	}

	public selectObject(obj: PIXI.DisplayObject, from: DataOrigin) {
		this.inspectors.forEach(p => p.selectObject(obj, from));
	}

	public init(game: Phaser.Game, root: Container) {
		const handle = document.createElement(ResizeHandle.tagName) as ResizeHandle;
		handle.init(this, this.side);
		this.appendChild(handle);
		this.inspectors.forEach(inspector => inspector.init(game, root));
		this.style.width = Editor.prefs.getPanelSize(this.side);
	}

	public enable() {
		this.inspectors.forEach(inspector => inspector.enable());
	}

	public disable() {
		this.inspectors.forEach(inspector => inspector.disable());
	}
}

customElements.define(Panel.tagName, Panel);