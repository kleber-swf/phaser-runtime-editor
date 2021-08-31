import { Data } from 'data';
import Phaser from 'phaser-ce';
import { Editor } from './editor/editor';
import './plugin.scss';
import { SceneEditor } from './scene/scene-editor';

export class Plugin extends Phaser.Plugin {
	public constructor(game: Phaser.Game, group?: Phaser.Group | Phaser.Stage) {
		super(game, game.plugins);

		const editor = document.createElement(Editor.tagName) as Editor;
		document.body.appendChild(editor);

		group = group ?? game.world;

		new SceneEditor(game, group, game.stage);

		Data.onSelectedObjectChanged.add(editor.selectObject, editor);

		const update = this.update;

		this.update = () => {
			if (group.children.length === 0) return;
			this.update = update;
			editor.setup(game, group);
		}
	}

	public postUpdate() {
		Data.dispatchScheduledEvents();
	}
}
