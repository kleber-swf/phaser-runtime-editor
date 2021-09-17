import { Editor } from 'core/editor';
import { EditorWindow } from 'editor.window';
import Phaser from 'phaser-ce';

export interface PluginConfig {
	root?: Container;
	refImage?: PIXI.Sprite;
	pauseGame?: boolean;
	clearPrefs?: boolean;
	onShow?: () => void;
	onHide?: () => void;
}

export class Plugin extends Phaser.Plugin {
	private readonly editorWindow: EditorWindow;
	private _disableVisibilityChangeMemento: boolean;
	private config: PluginConfig;
	private _gameSpeedMemento: number;

	public constructor(game: Phaser.Game, config?: PluginConfig) {
		super(game, game.plugins);
		this.insertHead();
		if (!config) config = {};
		this.config = config;
		this.editorWindow = new EditorWindow(game, config.root, config.refImage, config.clearPrefs);
		this.editorWindow.onshow = this.onEditorShow.bind(this);
		this.editorWindow.onhide = this.onEditorHide.bind(this);
		this.editorWindow.start();
	}

	private insertHead() {
		const head = document.head;
		const script = document.createElement('script');
		script.src = 'https://kit.fontawesome.com/7ba4e59e46.js';
		script.crossOrigin = 'anonymous';
		head.appendChild(script);

		let link = head.appendChild(document.createElement('link'));
		link.rel = 'preconnect';
		link.href = 'https://fonts.googleapis.com';

		link = head.appendChild(document.createElement('link'));
		link.rel = 'preconnect';
		link.href = 'https://fonts.gstatic.com';
		link.crossOrigin = 'true';

		link = head.appendChild(document.createElement('link'));
		link.rel = 'stylesheet';
		link.href = 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap';
	}

	public show() {
		this.editorWindow.show();
	}

	private onEditorShow() {
		(this as any).postUpdate = this._postUpdate.bind(this);
		this._disableVisibilityChangeMemento = this.game.stage.disableVisibilityChange;
		this.game.stage.disableVisibilityChange = true;
		this.hasPostUpdate = true;
		this._gameSpeedMemento = this.game.time.slowMotion;
		if (this.config.pauseGame) this.game.time.slowMotion = Number.POSITIVE_INFINITY
		if (this.config.onShow) this.config.onShow();
	}

	private onEditorHide() {
		this.hasPostUpdate = false;
		this.game.stage.disableVisibilityChange = this._disableVisibilityChangeMemento;
		(this as any).postUpdate = null;
		this.game.time.slowMotion = this._gameSpeedMemento;
		if (this.config.onHide) this.config.onHide();
	}

	private _postUpdate() {
		Editor.data.dispatchScheduledEvents();
	}
}

(Phaser.Plugin as any).RuntimeEditor = Plugin;
