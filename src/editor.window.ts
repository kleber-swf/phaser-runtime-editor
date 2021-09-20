import { Actions } from 'actions';
import { Editor } from 'core/editor';
import { DataOrigin } from 'data/editor-data';
import { DisabledUI } from 'disabled/disabled-ui';
import { EditorView } from 'editor-view/editor-view';
import { BooleanPropertyEditor } from 'editor-view/properties/editors/boolean/boolean-property-editor';
import { NumberPropertyEditor } from 'editor-view/properties/editors/number/number-property-editor';
import { PointPropertyEditor } from 'editor-view/properties/editors/point/point-property-editor';
import { RectPropertyEditor } from 'editor-view/properties/editors/rect/rect-property-editor';
import { StringPropertyEditor } from 'editor-view/properties/editors/string/string-property-editor';
import { TextPropertyEditor } from 'editor-view/properties/editors/string/text-property-editor';
import { ReferenceImage } from 'scene-view/reference-image';
import { SceneView } from 'scene-view/scene-view';

// TODO rename this class for God's sake
// TODO split this class into two:
// 	* one for data initialization
//		* and another for the workflow
export class EditorWindow {
	private _initialized = false;
	private disabledUI: DisabledUI;

	private sceneView: SceneView;
	private editorView: EditorView;

	private readonly game: Phaser.Game;
	private readonly root: Container;
	private readonly refImage?: PIXI.Sprite;
	private readonly clearPrefs?: boolean;

	public onshow: () => void;
	public onhide: () => void;

	constructor(game: Phaser.Game, root: Container, refImage?: PIXI.Sprite, clearPrefs?: boolean) {
		this.game = game;
		this.root = root ?? game.world;
		this.refImage = refImage;
		this.clearPrefs = clearPrefs;

		this.disabledUI = new DisabledUI();
		this.disabledUI.onclick = this.show.bind(this);
	}

	public start() {
		this.disabledUI.enable();
	}

	private init() {
		this._initialized = true;

		Editor.init(this.clearPrefs);
		this.setupInspectorData();

		const scene = this.sceneView = new SceneView(this.game);
		this.setupActions(scene);

		if (this.refImage) this.setupRefImage(this.refImage, this.root);

		this.editorView = document.createElement(EditorView.tagName) as EditorView;
		Editor.actions.addContainer('body', document.body);
	}

	public show() {
		this.disabledUI.disable();
		if (!this._initialized) this.init();

		this.sceneView.enable(this.root, this.game.stage);
		this.editorView.enable(this.game, this.root);
		Editor.enable();
		if (this.onshow) this.onshow();
	}

	private hide() {
		Editor.disable();
		this.sceneView.disable();
		this.editorView.disable();

		this.disabledUI.enable();
		if (this.onhide) this.onhide();
	}

	private setupInspectorData() {
		Editor.inspectorData.addTypeEditors({
			// basic types
			string: StringPropertyEditor.tagName,
			text: TextPropertyEditor.tagName,
			number: NumberPropertyEditor.tagName,
			boolean: BooleanPropertyEditor.tagName,

			// PIXI/Phaser types
			point: PointPropertyEditor.tagName,
			rect: RectPropertyEditor.tagName,

			// default
			default: StringPropertyEditor.tagName,
		});

		Editor.inspectorData.addInspectableProperties([
			{ name: '__type', label: 'type', typeHint: 'string', data: { readonly: true } },
			{ name: 'name', typeHint: 'string' },
			{ name: 'position', typeHint: 'point' },
			{ name: 'scale', typeHint: 'point', data: { step: 0.1 } },
			{ name: 'pivot', typeHint: 'point' },
			{ name: 'anchor', typeHint: 'point', data: { step: 0.1 } },
			{ name: 'alpha', typeHint: 'number', data: { min: 0, max: 1, step: 0.1 } },
			{ name: 'visible', typeHint: 'boolean' },
			{ name: 'angle', typeHint: 'number', data: { readonly: true } },
			{ name: '_bounds', label: 'bounds', typeHint: 'rect', data: { readonly: true } },

			// Sprite
			{ name: 'key', typeHint: 'string' },
			{ name: 'frameName', label: 'frame', typeHint: 'string' },
			{ name: 'blendMode', typeHint: 'number' },
			{ name: 'tint', typeHint: 'number', data: { min: 0, max: 0xFFFFFF } },

			// Text
			{ name: 'text', typeHint: 'text', data: { rows: 3 } },
			{ name: 'font', typeHint: 'string' },
			{ name: 'fontSize', typeHint: 'number', data: { min: 0, step: 1 } },
			{ name: 'fontStyle', typeHint: 'string' },
			{ name: 'fontVariant', typeHint: 'string' },
			{ name: 'fontWeight', typeHint: 'string' },
			{ name: 'autoRound', typeHint: 'boolean' },
			{ name: 'align', typeHint: 'string' },
			{ name: 'wordWrap', typeHint: 'boolean' },
			{ name: 'wordWrapWidth', typeHint: 'number', data: { min: 0, step: 1 } },
			{ name: 'useAdvancedWordWrap', typeHint: 'boolean' },
			{ name: 'padding', typeHint: 'point' },
			// { name: 'textBounds', typeHint: 'rect' },  // TODO waiting for null checking on rect editor
			{ name: 'boundsAlignH', typeHint: 'string' },
			{ name: 'boundsAlignV', typeHint: 'string' },

		]);

		const basicProperties = {
			title: '', properties: [
				'__type', 'name', 'position', 'scale', 'pivot', 'anchor',
				'alpha', 'visible', 'angle', '_bounds'
			]
		};

		Editor.inspectorData.addObjectProperties('default', [basicProperties]);

		Editor.inspectorData.addObjectProperties('Phaser.Sprite', [
			basicProperties,
			{ title: 'Sprite', properties: ['key', 'frameName', 'blendMode', 'tint'] },
		]);

		Editor.inspectorData.addObjectProperties('Phaser.Image', [
			basicProperties,
			{ title: 'Sprite', properties: ['key', 'frameName', 'blendMode', 'tint'] },
		]);

		Editor.inspectorData.addObjectProperties('Phaser.Graphics', [
			basicProperties,
			{ title: 'Sprite', properties: ['blendMode', 'tint'] },
		]);

		Editor.inspectorData.addObjectProperties('Phaser.Text', [
			basicProperties,
			{ title: 'Sprite', properties: ['blendMode', 'tint'] },
			{
				title: 'Text',
				properties: [
					'text', 'font', 'fontSize', 'fontStyle', 'fontVariant', 'fontWeight', 'autoRound',
					'divider',
					'align', 'wordWrap', 'wordWrapWidth', 'useAdvancedWordWrap',
					'divider',
					'padding', /*'textBounds', */'boundsAlignH', 'boundsAlignV']
			},
		]);

		Editor.inspectorData.addObjectProperties('Phaser.BitmapText', [
			basicProperties,
			{ title: 'Sprite', properties: ['tint'] },
			{ title: 'Bitmap Text', properties: ['font', 'fontSize', 'align'] },
		]);

	}

	private setupActions(scene: SceneView) {
		const { history, prefs } = Editor;
		Editor.actions.add(
			{
				id: Actions.UNDO,
				label: 'undo',
				icon: 'fa-undo-alt',
				shortcut: 'ctrl+z',
				command: history.undo.bind(history)
			},
			{
				id: Actions.MOVE_UP_1,
				shortcut: 'ArrowUp',
				command: () => scene.moveSelectedObject(0, -1)
			},
			{
				id: Actions.MOVE_DOWN_1,
				shortcut: 'ArrowDown',
				command: () => scene.moveSelectedObject(0, 1)
			},
			{
				id: Actions.MOVE_LEFT_1,
				shortcut: 'ArrowLeft',
				command: () => scene.moveSelectedObject(-1, 0)
			},
			{
				id: Actions.MOVE_RIGHT_1,
				shortcut: 'ArrowRight',
				command: () => scene.moveSelectedObject(1, 0)
			},
			{
				id: Actions.MOVE_UP_10,
				shortcut: 'shift+ArrowUp',
				command: () => scene.moveSelectedObject(0, -10)
			},
			{
				id: Actions.MOVE_DOWN_10,
				shortcut: 'shift+ArrowDown',
				command: () => scene.moveSelectedObject(0, 10)
			},
			{
				id: Actions.MOVE_LEFT_10,
				shortcut: 'shift+ArrowLeft',
				command: () => scene.moveSelectedObject(-10, 0)
			},
			{
				id: Actions.MOVE_RIGHT_10,
				shortcut: 'shift+ArrowRight',
				command: () => scene.moveSelectedObject(10, 0)
			},
			{
				id: Actions.TOGGLE_SNAP,
				label: 'snap',
				icon: 'fa-border-all',
				toggle: true,
				command: () => prefs.snap = !prefs.snap,
				state: () => prefs.snap,
			},
			{
				id: Actions.TOGGLE_GIZMOS,
				label: 'gizmos',
				icon: 'fa-vector-square',
				toggle: true,
				hold: true,
				shortcut: 'ctrl+shift+Shift',
				command: () => prefs.gizmos = !prefs.gizmos,
				state: () => prefs.gizmos,
			},
			{
				id: Actions.TOGGLE_GIZMOS,
				label: 'gizmos',
				icon: 'fa-vector-square',
				toggle: true,
				hold: true,
				shortcut: 'ctrl+shift+Control',
				command: () => prefs.gizmos = !prefs.gizmos,
				state: () => prefs.gizmos,
			},
			{
				id: Actions.TOGGLE_GUIDES,
				toggle: true,
				label: 'guides',
				icon: 'fa-compress',
				command: () => prefs.guides = !prefs.guides,
				state: () => prefs.guides,
			},
			{
				id: Actions.TOGGLE_ENABLED,
				label: 'edit',
				icon: 'fa-edit',
				toggle: true,
				command: this.hide.bind(this),
				state: () => true,
			},
			{
				id: Actions.PRINT_OBJECT,
				label: 'print',
				icon: 'fa-terminal',
				shortcut: 'ctrl+alt+p',
				command: () => {
					if (Editor.data.selectedObject) {
						console.info(Editor.data.selectedObject);
					}
				}
			},
			{
				id: Actions.DESELECT,
				shortcut: 'Escape',
				command: () => Editor.data.selectObject(null, DataOrigin.ACTION)
			},
		);
	}

	private setupRefImage(refImage: PIXI.Sprite, root: Container) {
		Editor.referenceImage = new ReferenceImage(this.game, refImage, root);
		Editor.actions.add({
			id: Actions.TOGGLE_REF_IMAGE,
			label: 'reference',
			icon: 'fa-image',
			toggle: true,
			state: () => Editor.prefs.referenceImage,
			command: () => Editor.prefs.referenceImage = !Editor.prefs.referenceImage,
		});
	}
}