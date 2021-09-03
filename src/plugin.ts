import { Actions } from 'data/actions';
import { Data } from 'data/data';
import { History } from 'data/history';
import Phaser from 'phaser-ce';
import { Editor } from './editor/editor';
import './plugin.scss';
import { SceneEditor } from './scene/scene-editor';

export class Plugin extends Phaser.Plugin {
	public constructor(game: Phaser.Game, group?: Phaser.Group | Phaser.Stage) {
		super(game, game.plugins);
		group = group ?? game.world;

		const scene = new SceneEditor(game, group, game.stage);
		this.setupActions(scene);

		const editor = document.createElement(Editor.tagName) as Editor;
		document.body.appendChild(editor);

		const update = this.update;
		this.update = () => {
			if (group.children.length === 0) return;
			this.update = update;
			editor.setup(game, group);
		}
	}

	private setupActions(scene: SceneEditor) {
		Actions.add(
			{ id: 'UNDO', label: 'undo', icon: 'fa-undo-alt', shortcut: 'ctrl+z', command: History.undo.bind(History) },
			{ id: 'MOVE_UP_1', shortcut: 'ArrowUp', command: () => scene.moveSelectedObject(0, -1) },
			{ id: 'MOVE_DOWN_1', shortcut: 'ArrowDown', command: () => scene.moveSelectedObject(0, 1) },
			{ id: 'MOVE_LEFT_1', shortcut: 'ArrowLeft', command: () => scene.moveSelectedObject(-1, 0) },
			{ id: 'MOVE_RIGHT_1', shortcut: 'ArrowRight', command: () => scene.moveSelectedObject(1, 0) },
			{ id: 'MOVE_UP_10', shortcut: 'shift+ArrowUp', command: () => scene.moveSelectedObject(0, -10) },
			{ id: 'MOVE_DOWN_10', shortcut: 'shift+ArrowDown', command: () => scene.moveSelectedObject(0, 10) },
			{ id: 'MOVE_LEFT_10', shortcut: 'shift+ArrowLeft', command: () => scene.moveSelectedObject(-10, 0) },
			{ id: 'MOVE_RIGHT_10', shortcut: 'shift+ArrowRight', command: () => scene.moveSelectedObject(10, 0) },
		);

	}

	public postUpdate() {
		Data.dispatchScheduledEvents();
	}
}
