import { Data } from 'data';
import Phaser from 'phaser-ce';
import { Editor } from './editor/editor';
import './plugin.scss';
import { SceneEditor } from './scene/scene-editor';

export class Plugin extends Phaser.Plugin {
	public constructor(game: Phaser.Game, group?: Phaser.Group | Phaser.Stage) {
		super(game, game.plugins);

		const stage = document.createElement(Editor.tagName) as Editor;
		document.body.appendChild(stage);

		group = group ?? game.world;

		new SceneEditor(game, group, game.stage);
		stage.game = game;

		Data.onSelectedObjectChanged.add(stage.selectObject, stage);
	}

	public postUpdate() {
		Data.dispatchScheduledEvents();
	}
}
