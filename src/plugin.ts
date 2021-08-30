import Phaser from 'phaser-ce';
import { EditorView } from './editor/editor.view';
import { Stage } from './ui/stage';

export class Plugin extends Phaser.Plugin {
	public constructor(game: Phaser.Game, group?: Phaser.Group | Phaser.Stage) {
		super(game, game.plugins);

		const stage = document.createElement(Stage.tagId) as Stage;
		document.body.appendChild(stage);

		group = group ?? game.world;
		new EditorView(game, group, game.stage);

		stage.game = game;
	}
}
