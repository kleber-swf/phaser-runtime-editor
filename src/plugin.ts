import { Data } from 'data/data';
import Phaser from 'phaser-ce';
import { Editor } from './core/editor';
import { EditorView } from './editor-view/editor-view';
import './plugin.scss';
import { SceneView } from './scene-view/scene-view';

export class Plugin extends Phaser.Plugin {
	public constructor(game: Phaser.Game, group?: Phaser.Group | Phaser.Stage) {
		super(game, game.plugins);
		group = group ?? game.world;

		Editor.init();

		const scene = new SceneView(game, group, game.stage);
		this.setupActions(scene);

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

	private setupActions(scene: SceneView) {
		const { history, prefs } = Editor;
		Editor.actions.add(
			{
				id: 'UNDO',
				label: 'undo',
				icon: 'fa-undo-alt',
				shortcut: 'ctrl+z',
				command: history.undo.bind(history)
			},
			{
				id: 'MOVE_UP_1',
				shortcut: 'ArrowUp',
				command: () => scene.moveSelectedObject(0, -1)
			},
			{
				id: 'MOVE_DOWN_1',
				shortcut: 'ArrowDown',
				command: () => scene.moveSelectedObject(0, 1)
			},
			{
				id: 'MOVE_LEFT_1',
				shortcut: 'ArrowLeft',
				command: () => scene.moveSelectedObject(-1, 0)
			},
			{
				id: 'MOVE_RIGHT_1',
				shortcut: 'ArrowRight',
				command: () => scene.moveSelectedObject(1, 0)
			},
			{
				id: 'MOVE_UP_10',
				shortcut: 'shift+ArrowUp',
				command: () => scene.moveSelectedObject(0, -10)
			},
			{
				id: 'MOVE_DOWN_10',
				shortcut: 'shift+ArrowDown',
				command: () => scene.moveSelectedObject(0, 10)
			},
			{
				id: 'MOVE_LEFT_10',
				shortcut: 'shift+ArrowLeft',
				command: () => scene.moveSelectedObject(-10, 0)
			},
			{
				id: 'MOVE_RIGHT_10',
				shortcut: 'shift+ArrowRight',
				command: () => scene.moveSelectedObject(10, 0)
			},
			{
				id: 'TOGGLE_SNAP',
				label: 'snap',
				icon: 'fa-compress',
				toggle: true,
				command: () => prefs.snap = !prefs.snap,
				state: () => prefs.snap,
			},
			{
				id: 'TOGGLE_GIZMOS',
				toggle: true,
				hold: true,
				shortcut: 'shift+Shift',
				command: () => prefs.gizmos = !prefs.gizmos,
				state: () => prefs.gizmos,
			},
		);
	}

	public postUpdate() {
		Data.dispatchScheduledEvents();
	}
}
