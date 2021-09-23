import { ComponentTags } from 'component-tags';
import { Actions } from 'core/actions';
import { Editor } from 'core/editor';
import { DisabledUI } from 'disabled/disabled-ui';
import { EditorView } from 'editor-view/editor-view';
import { PluginConfig } from 'plugin';
import { SceneView } from 'scene-view/scene-view';

// TODO rename this class for God's sake
// TODO split this class into two:
// 	* one for data initialization
//		* and another for the workflow
export class EditorWindow {
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
		// this.setupActions(scene);
		// Editor.actions.addContainer('body', document.body);
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

	// private setupActions(scene: SceneView) {
	// 	const { history, prefs } = Editor;
	// 	Editor.actions.add(
	// 		{
	// 			id: Actions.UNDO,
	// 			label: 'undo',
	// 			icon: 'fa-undo-alt',
	// 			shortcuts: ['ctrl+z'],
	// 			command: history.undo.bind(history)
	// 		},
	// 		{
	// 			id: Actions.MOVE_UP_1,
	// 			shortcuts: ['ArrowUp'],
	// 			command: () => scene.moveSelectedObject(0, -1)
	// 		},
	// 		{
	// 			id: Actions.MOVE_DOWN_1,
	// 			shortcuts: ['ArrowDown'],
	// 			command: () => scene.moveSelectedObject(0, 1)
	// 		},
	// 		{
	// 			id: Actions.MOVE_LEFT_1,
	// 			shortcuts: ['ArrowLeft'],
	// 			command: () => scene.moveSelectedObject(-1, 0)
	// 		},
	// 		{
	// 			id: Actions.MOVE_RIGHT_1,
	// 			shortcuts: ['ArrowRight'],
	// 			command: () => scene.moveSelectedObject(1, 0)
	// 		},
	// 		{
	// 			id: Actions.MOVE_UP_10,
	// 			shortcuts: ['shift+ArrowUp'],
	// 			command: () => scene.moveSelectedObject(0, -10)
	// 		},
	// 		{
	// 			id: Actions.MOVE_DOWN_10,
	// 			shortcuts: ['shift+ArrowDown'],
	// 			command: () => scene.moveSelectedObject(0, 10)
	// 		},
	// 		{
	// 			id: Actions.MOVE_LEFT_10,
	// 			shortcuts: ['shift+ArrowLeft'],
	// 			command: () => scene.moveSelectedObject(-10, 0)
	// 		},
	// 		{
	// 			id: Actions.MOVE_RIGHT_10,
	// 			shortcuts: ['shift+ArrowRight'],
	// 			command: () => scene.moveSelectedObject(10, 0)
	// 		},
	// 		{
	// 			id: Actions.TOGGLE_SNAP,
	// 			label: 'snap',
	// 			icon: 'fa-border-all',
	// 			toggle: true,
	// 			command: () => prefs.snap = !prefs.snap,
	// 			state: () => prefs.snap,
	// 		},
	// 		{
	// 			id: Actions.TOGGLE_GIZMOS,
	// 			label: 'gizmos',
	// 			icon: 'fa-vector-square',
	// 			toggle: true,
	// 			hold: true,
	// 			shortcuts: ['ctrl+shift+Shift', 'ctrl+shift+Control'],
	// 			command: () => prefs.gizmos = !prefs.gizmos,
	// 			state: () => prefs.gizmos,
	// 		},
	// 		{
	// 			id: Actions.TOGGLE_GUIDES,
	// 			toggle: true,
	// 			label: 'guides',
	// 			icon: 'fa-compress',
	// 			command: () => prefs.guides = !prefs.guides,
	// 			state: () => prefs.guides,
	// 		},
	// 		{
	// 			id: Actions.TOGGLE_ENABLED,
	// 			label: 'edit',
	// 			icon: 'fa-edit',
	// 			toggle: true,
	// 			command: this.hide.bind(this),
	// 			state: () => true,
	// 		},
	// 		{
	// 			id: Actions.PRINT_OBJECT,
	// 			label: 'print',
	// 			icon: 'fa-terminal',
	// 			shortcuts: ['ctrl+alt+p'],
	// 			command: () => {
	// 				if (Editor.data.selectedObject) {
	// 					console.info(Editor.data.selectedObject);
	// 				}
	// 			}
	// 		},
	// 		{
	// 			id: Actions.DESELECT,
	// 			shortcuts: ['Escape'],
	// 			command: () => Editor.data.selectObject(null, DataOrigin.ACTION)
	// 		},
	// 	);
	// }

	// private setupRefImage(refImage: PIXI.Sprite, root: Container) {
	// 	Editor.referenceImage = new ReferenceImage(this.game, refImage, root);
	// 	Editor.actions.add({
	// 		id: Actions.TOGGLE_REF_IMAGE,
	// 		label: 'reference',
	// 		icon: 'fa-image',
	// 		toggle: true,
	// 		state: () => Editor.prefs.referenceImage,
	// 		command: () => Editor.prefs.referenceImage = !Editor.prefs.referenceImage,
	// 	});
	// }
}