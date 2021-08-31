import { Data } from 'data';
import Phaser from 'phaser-ce';
import { SceneEditor } from './scene/scene-editor';
import './plugin.scss';
import { Stage } from './ui/stage';

export class Plugin extends Phaser.Plugin {
	public constructor(game: Phaser.Game, group?: Phaser.Group | Phaser.Stage) {
		super(game, game.plugins);

		const stage = document.createElement(Stage.tagName) as Stage;
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
