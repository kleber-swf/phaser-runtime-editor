import Phaser from 'phaser-ce';
import { EditorView } from './editor/editor.view';
import { Stage } from './ui/stage';

import './plugin.scss';

export class Plugin extends Phaser.Plugin {
	public constructor(game: Phaser.Game, group?: Phaser.Group | Phaser.Stage) {
		super(game, game.plugins);

		const stage = document.createElement(Stage.tagId) as Stage;
		document.body.appendChild(stage);

		group = group ?? game.world;
		const editor = new EditorView(game, group, game.stage);
		stage.game = game;
		editor.onSelectedObjectChanged.add(stage.selectObject, stage);
	}
}
