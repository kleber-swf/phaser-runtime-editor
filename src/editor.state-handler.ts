import { ComponentTags } from 'component-tags';
import { Actions } from 'core/actions';
import { Editor } from 'core/editor';
import { DisabledUI } from 'disabled/disabled-ui';
import { EditorView } from 'editor-view/editor-view';
import { PluginConfig } from 'plugin.model';
import { ReferenceImageController } from 'reference-image/reference-image.controller';
import { SceneView } from 'scene-view/scene-view';

export class EditorStateHandler {
	private _initialized = false;
	private _isEnabled = false;
	private disabledUI: DisabledUI;

	private sceneView: SceneView;
	private editorView: EditorView;
	private referenceImageController: ReferenceImageController;

	private readonly game: Phaser.Game;
	private config: PluginConfig;

	public onshow: () => void;
	public onhide: () => void;

	constructor(game: Phaser.Game) {
		this.game = game;
		this.disabledUI = new DisabledUI();
		this.disabledUI.onclick = this.show.bind(this);
	}

	public start() { this.disabledUI.enable(); }

	private init() {
		this._initialized = true;
		Editor.init(this.config);

		this.sceneView = new SceneView(this.game);
		this.editorView = document.createElement(ComponentTags.EditorView) as EditorView;
		this.referenceImageController = new ReferenceImageController(this.game, this.config);

		this.editorView.init(this.game, this.config);

		this.setupInitialActions();
	}

	private setupInitialActions() {
		Editor.setupInitialActions();

		const actions = Editor.actions;
		actions.setActionCommand(Actions.TOGGLE_ENABLED,
			() => this._isEnabled ? this.hide() : this.show(this.config),
			() => this._isEnabled);

		this.editorView.setupActions(actions);
		this.sceneView.setupActions(actions);
		this.referenceImageController.setupActions(actions);

		actions.addContainer('body', document.body);
	}

	public show(context: PluginConfig) {
		if (this._isEnabled) return;
		this._isEnabled = true;
		this.config = context;
		this.disabledUI.disable();
		if (!this._initialized) this.init();

		this.sceneView.enable(context.root, this.game.stage);
		this.editorView.enable(context);
		this.referenceImageController.enable(context.refImage);

		Editor.enable();
		if (this.onshow) this.onshow();
	}

	private hide() {
		if (!this._isEnabled) return;
		this._isEnabled = false;
		Editor.disable();
		this.sceneView.disable();
		this.editorView.disable();
		this.referenceImageController.disable();

		this.disabledUI.enable();
		if (this.onhide) this.onhide();
	}
}