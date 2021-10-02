import { Editor } from 'core/editor';
import { DataOrigin } from 'data/editor-data';
import { Inspector } from 'editor-view/inspector/inspector';
import { Widget } from 'editor-view/widget/widget';
import { ComponentTags } from 'component-tags';
import { PanelSide } from 'types';
import './panel.scss';
import { ResizeHandle } from './resize-handle/resize-handle';
import { PluginConfig } from 'plugin';

export class Panel extends Widget {
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

	public init(game: Phaser.Game) {
		const handle = document.createElement(ComponentTags.ResizeHandle) as ResizeHandle;
		handle.init(this, this.side);
		this.appendChild(handle);
		this.inspectors.forEach(inspector => inspector.init(game));
		this.style.width = Editor.prefs.getPanelSize(this.side);
	}

	public enable(config: PluginConfig) {
		this.inspectors.forEach(inspector => inspector.enable(config));
	}

	public disable() {
		this.inspectors.forEach(inspector => inspector.disable());
	}
}

customElements.define(ComponentTags.Panel, Panel);