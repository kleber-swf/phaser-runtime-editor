import { Editor } from 'core/editor';
import { EditorStateHandler } from 'editor.state-handler';
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
	private readonly editorState: EditorStateHandler;
	private gamePreState: { disableVisibilityChange: boolean, slowMotion: number };
	private config: PluginConfig;

	public constructor(game: Phaser.Game, config?: PluginConfig) {
		super(game, game.plugins);
		this.insertHead();
		if (!config) config = {};
		config.root = config.root ?? game.world
		this.config = config;

		this.editorState = new EditorStateHandler(game, config);
		this.editorState.onshow = this.onEditorShow.bind(this);
		this.editorState.onhide = this.onEditorHide.bind(this);
		this.editorState.start();
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
		this.editorState.show();
	}

	private onEditorShow() {
		(this as any).postUpdate = this._postUpdate.bind(this);
		this.hasPostUpdate = true;

		this.gamePreState = {
			disableVisibilityChange: this.game.stage.disableVisibilityChange,
			slowMotion: this.game.time.slowMotion,
		};

		this.game.stage.disableVisibilityChange = true;
		if (this.config.pauseGame) this.game.time.slowMotion = Number.POSITIVE_INFINITY;

		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		if (this.config.onShow) this.config.onShow();
	}

	private onEditorHide() {
		this.hasPostUpdate = false;
		(this as any).postUpdate = null;
		this.game.stage.disableVisibilityChange = this.gamePreState.disableVisibilityChange;
		this.game.time.slowMotion = this.gamePreState.slowMotion;
		if (this.config.onHide) this.config.onHide();
	}

	private _postUpdate() {
		Editor.data.dispatchScheduledEvents();
	}
}

(Phaser.Plugin as any).RuntimeEditor = Plugin;
