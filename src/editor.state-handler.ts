import { Actions } from 'core/actions';
import { Editor } from 'core/editor';
import { DisabledUI } from 'disabled/disabled-ui';
import { EditorView } from 'editor-view/editor-view';
import { PluginConfig, PluginConfigBuilder } from 'plugin.model';

export class EditorStateHandler {
	private _initialized = false;
	private _isEnabled = false;
	private disabledUI: DisabledUI;

	private editorView: EditorView;
	// private referenceImageController: ReferenceImageController;

	private readonly game: Phaser.Game;
	private configBuilder: PluginConfigBuilder;
	private config: PluginConfig;

	public onshow: () => void;
	public onhide: () => void;

	constructor(game: Phaser.Game, configBuilder: PluginConfigBuilder) {
		this.game = game;
		this.configBuilder = configBuilder;
		this.disabledUI = new DisabledUI();
		this.disabledUI.onclick = this.show.bind(this);
	}

	public start() { this.disabledUI.enable(); }

	private init(config: PluginConfig) {
		this._initialized = true;
		Editor.init(config);

		this.editorView = document.createElement(EditorView.tagName) as EditorView;
		// this.referenceImageController = new ReferenceImageController(this.game, config);

		this.editorView.init(this.game);

		this.setupInitialActions();
	}

	private setupInitialActions() {
		Editor.setupInitialActions();

		const actions = Editor.actions;
		actions.setActionCommand(
			Actions.TOGGLE_ENABLED,
			() => this._isEnabled ? this.hide() : this.show(),
			() => this._isEnabled
		);

		this.editorView.setupActions(actions);
		// this.referenceImageController.setupActions(actions);

		actions.addContainer('body', document.body);
	}

	public show() {
		if (this._isEnabled) return;
		this.config = this.createConfig(this.configBuilder);
		this._isEnabled = true;
		this.disabledUI.disable();
		if (!this._initialized) this.init(this.config);

		this.editorView.enable(this.config);
		// this.referenceImageController.enable(this.config.refImage);

		Editor.enable();
		if (this.onshow) this.onshow();
	}

	private createConfig(builder: PluginConfigBuilder): PluginConfig {
		return {
			clearPrefs: builder.clearPrefs,
			pauseGame: builder.pauseGame,
			refImage: builder.refImage(),
			root: builder.root(),
		};
	}

	private hide() {
		if (!this._isEnabled) return;
		this._isEnabled = false;
		Editor.disable();
		this.editorView.disable();
		// this.referenceImageController.disable();

		this.disabledUI.enable();
		if (this.onhide) this.onhide();
	}
}
