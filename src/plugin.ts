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

		Actions.add({ label: 'undo', icon: 'fa-undo-alt', shortcut: 'ctrl+z', command: History.undo.bind(History) });

		const editor = document.createElement(Editor.tagName) as Editor;
		document.body.appendChild(editor);

		new SceneEditor(game, group, game.stage);

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
