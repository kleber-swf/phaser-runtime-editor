import { Actions } from 'actions';
import { BooleanPropertyEditor } from 'editor-view/properties/editors/boolean/boolean-property-editor';
import { NumberPropertyEditor } from 'editor-view/properties/editors/number/number-property-editor';
import { PointPropertyEditor } from 'editor-view/properties/editors/point/point-property-editor';
import { StringPropertyEditor } from 'editor-view/properties/editors/string/string-property-editor';
import Phaser from 'phaser-ce';
import { Editor } from './core/editor';
import { EditorView } from './editor-view/editor-view';
import './plugin.scss';
import { SceneView } from './scene-view/scene-view';

export class Plugin extends Phaser.Plugin {
	public constructor(game: Phaser.Game, group?: Phaser.Group | Phaser.Stage, refImage?: Phaser.Image) {
		super(game, game.plugins);
		group = group ?? game.world;

		Editor.init();
		this.setupInspectorData();

		const scene = new SceneView(game, group, game.stage);
		this.setupActions(scene);
		if (refImage) this.setupRefImage(refImage);

		const editorView = document.createElement(EditorView.tagName) as EditorView;
		document.body.appendChild(editorView);

		const update = this.update;
		this.update = () => {
			if (group.children.length === 0) return;
			this.update = update;
			editorView.setup(game, group);
		}

		Editor.actions.setContainer('#phred-game-container');
	}

	private setupInspectorData() {
		Editor.inspectorData.addEditors({
			// basic types
			string: StringPropertyEditor.tagName,
			number: NumberPropertyEditor.tagName,
			boolean: BooleanPropertyEditor.tagName,

			// PIXI/Phaser types
			point: PointPropertyEditor.tagName,

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
				icon: 'fa-compress',
				toggle: true,
				command: () => prefs.snap = !prefs.snap,
				state: () => prefs.snap,
			},
			{
				id: Actions.TOGGLE_GIZMOS,
				toggle: true,
				hold: true,
				shortcut: 'shift+Shift',
				command: () => prefs.gizmos = !prefs.gizmos,
				state: () => prefs.gizmos,
			},
		);
	}

	public setupRefImage(refImage: Phaser.Image) {

	}

	public postUpdate() {
		Editor.data.dispatchScheduledEvents();
	}
}
