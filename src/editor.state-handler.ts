import { ComponentTags } from 'component-tags';
import { Actions } from 'core/actions';
import { Editor } from 'core/editor';
import { DisabledUI } from 'disabled/disabled-ui';
import { EditorView } from 'editor-view/editor-view';
import { PluginConfig } from 'plugin';
import { SceneView } from 'scene-view/scene-view';

export class EditorStateHandler {
	private _initialized = false;
	private _isEnabled = false;
	private disabledUI: DisabledUI;

	private sceneView: SceneView;
	private editorView: EditorView;

	private readonly game: Phaser.Game;
	private readonly config: PluginConfig;

	public onshow: () => void;
	public onhide: () => void;

	constructor(game: Phaser.Game, config: PluginConfig) {
		this.game = game;
		this.config = config;

		this.disabledUI = new DisabledUI();
		this.disabledUI.onclick = this.show.bind(this);
	}

	public start() { this.disabledUI.enable(); }

	private init() {
		this._initialized = true;
		Editor.init(this.config.clearPrefs);

		this.sceneView = new SceneView(this.game);
		this.editorView = document.createElement(ComponentTags.EditorView) as EditorView;

		// if (this.refImage) this.setupRefImage(this.refImage, this.root);

		this.setupInitialActions();
	}

	private setupInitialActions() {
		Editor.setupInitialActions();

		const actions = Editor.actions;
		actions.setActionCommand(Actions.TOGGLE_ENABLED,
			() => this._isEnabled ? this.hide() : this.show(),
			() => this._isEnabled);

		this.editorView.setupActions(actions);
		this.sceneView.setupActions(actions);

		actions.addContainer('body', document.body);
	}

	public show() {
		if (this._isEnabled) return;
		this._isEnabled = true;
		this.disabledUI.disable();
		if (!this._initialized) this.init();

		this.sceneView.enable(this.config.root, this.game.stage);
		this.editorView.enable(this.game, this.config.root);
		Editor.enable();
		if (this.onshow) this.onshow();
	}

	private hide() {
		if (!this._isEnabled) return;
		this._isEnabled = false;
		Editor.disable();
		this.sceneView.disable();
		this.editorView.disable();

		this.disabledUI.enable();
		if (this.onhide) this.onhide();
	}
}