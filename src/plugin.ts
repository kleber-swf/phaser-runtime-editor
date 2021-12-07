import { Editor } from 'core/editor';
import { EditorStateHandler } from 'editor.state-handler';
import Phaser from 'phaser-ce';
import { PluginConfig, PluginConfigBuilder } from 'plugin.model';

interface GameStateConfig {
	disableVisibilityChange: boolean;
	slowMotion: number;
	scaleMode: number;
}

export class Plugin extends Phaser.Plugin {
	private readonly editorState: EditorStateHandler;
	private gamePreState: GameStateConfig;
	private configBuilder: PluginConfigBuilder;
	// private config: PluginConfig;

	public constructor(game: Phaser.Game, config?: PluginConfigBuilder) {
		super(game, game.plugins);
		this.insertHead();
		if (!config) config = {};
		if (!config.root) config.root = () => game.world;
		if (!config.refImage) config.refImage = () => null;
		this.configBuilder = config;
		// this.config = {
		// 	root: null,
		// 	refImage: null,
		// 	clearPrefs: config.clearPrefs ?? false,
		// 	pauseGame: config.pauseGame ?? false,
		// };

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

		const el = document.querySelector('#phaser-runtime-editor');
		if (!el) return;
		const src = el.getAttribute('src');
		if (!src) return;

		link = head.appendChild(document.createElement('link'));
		link.rel = 'stylesheet';
		link.href = src.replace('.min.js', '.css');
	}

	public show() { this.editorState.show(); }

	private onEditorShow() {
		(this as any).postUpdate = this._postUpdate.bind(this);
		this.hasPostUpdate = true;

		const game = this.game;

		// saves the pre editor game state
		this.gamePreState = {
			disableVisibilityChange: game.stage.disableVisibilityChange,
			slowMotion: game.time.slowMotion,
			scaleMode: game.scale.scaleMode,
		};

		// applies some properties to the game
		game.stage.disableVisibilityChange = true;
		if (this.configBuilder.pauseGame) game.time.slowMotion = Number.POSITIVE_INFINITY;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		if (this.configBuilder.onShow) this.configBuilder.onShow();
	}

	private onEditorHide() {
		this.hasPostUpdate = false;
		(this as any).postUpdate = null;

		// recovers pre editor game state
		const { game, gamePreState } = this;
		game.stage.disableVisibilityChange = gamePreState.disableVisibilityChange;
		game.time.slowMotion = gamePreState.slowMotion;
		game.scale.scaleMode = gamePreState.scaleMode;

		if (this.configBuilder.onHide) this.configBuilder.onHide();
	}

	private _postUpdate() {
		Editor.data.dispatchScheduledEvents();
	}
}

(Phaser.Plugin as any).RuntimeEditor = Plugin;

Object.defineProperty(PIXI.DisplayObject.prototype, 'globalScale', {
	enumerable: true,
	configurable: true,
	get() { return new PIXI.Point(this.worldTransform.a, this.worldTransform.d); }
})