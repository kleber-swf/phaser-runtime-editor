import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences';
import { DataOrigin } from 'data/editor-data';
import { Inspector } from 'editor-view/inspector/inspector';
import { Widget } from 'editor-view/widget/widget';
import { PluginConfig } from 'plugin.model';
import { PanelSide } from 'types';
import './panel.scss';
import { PanelResizeHandle } from './resize-handle/panel-resize-handle';

export class Panel extends Widget {
	public static readonly tagName = 'phred-panel';

	private readonly inspectors: Inspector[] = [];
	private side: PanelSide;
	private prefKey: PreferenceKey;

	public set visible(value: boolean) {
		if (value) {
			this.classList.remove('hidden');
		} else if (!this.classList.contains('hidden')) {
			this.classList.add('hidden');
		}
	}

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
		const handle = document.createElement(PanelResizeHandle.tagName) as PanelResizeHandle;
		this.prefKey = (this.side + 'PanelVisible') as PreferenceKey;
		const widthPrefKey = (this.side + 'PanelSize') as PreferenceKey;

		handle.init(this, this.side);
		this.appendChild(handle);
		this.inspectors.forEach(inspector => inspector.init(game));
		this.style.width = Editor.prefs.get(widthPrefKey) as string;

		this.onPreferencesChanged(this.prefKey, Editor.prefs.get(this.prefKey));
		Editor.prefs.onPreferenceChanged.add(this.onPreferencesChanged, this);
	}

	public enable(config: PluginConfig) {
		this.inspectors.forEach(inspector => inspector.enable(config));
	}

	public disable() {
		this.inspectors.forEach(inspector => inspector.disable());
	}

	private onPreferencesChanged(key: PreferenceKey, value: any) {
		if (key === this.prefKey) {
			this.visible = value === true;
		}
	}
}

customElements.define(Panel.tagName, Panel);
