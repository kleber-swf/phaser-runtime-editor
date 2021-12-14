import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences/preferences.model';
import { PreferencesUtil } from 'core/preferences/preferences.util';
import { DataOrigin } from 'data/editor-data';
import { Inspector } from 'editor-view/inspector/inspector';
import { Widget } from 'editor-view/widget/widget';
import { Side, PluginConfig } from 'plugin.model';
import './panel.scss';
import { PanelResizeHandle } from './resize-handle/panel-resize-handle';

export class Panel extends Widget {
	public static readonly tagName = 'phred-panel';

	private readonly inspectors: Inspector[] = [];
	private side: Side;
	private visiblePrefKey: PreferenceKey;

	public set visible(value: boolean) {
		this.classList.addOrRemove('hidden', !value);
	}

	public setSide(value: Side) {
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
		this.visiblePrefKey = (this.side + 'PanelVisible') as PreferenceKey;
		const sizePrefKey = (this.side + 'PanelSize') as PreferenceKey;

		handle.init(this, this.side);
		this.appendChild(handle);
		this.inspectors.forEach(inspector => inspector.init(game, this.side));
		this.style.width = Editor.prefs.get(sizePrefKey) as string;

		PreferencesUtil.setupPreferences([this.visiblePrefKey], this.onPreferencesChanged, this);
	}

	public enable(config: PluginConfig) {
		this.inspectors.forEach(inspector => inspector.enable(config));
	}

	public disable() {
		this.inspectors.forEach(inspector => inspector.disable());
	}

	private onPreferencesChanged(key: PreferenceKey, value: any) {
		if (key === this.visiblePrefKey) {
			this.visible = value === true;
		}
	}
}

customElements.define(Panel.tagName, Panel);
