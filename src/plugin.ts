import Phaser from 'phaser-ce';
import { Stage } from './ui/stage';


export class Plugin extends Phaser.Plugin {
	public constructor(game: Phaser.Game, group?: Phaser.Group | Phaser.Stage) {
		super(game, game.plugins);

		const stage = document.createElement('div', { is: Stage.eid }) as Stage;
		document.body.appendChild(stage);

		stage.game = game;
	}

	// toggleEditor() {
	// 	if (!this.container) {
	// 		this.container = new EditorContainer(this.game, this.group);
	// 		this.game.stage.add(this.container);
	// 	}
	// 	this.container.toggleVisible();
	// 	this.game.stage.setChildIndex(this.menu, this.game.stage.children.length - 1);
	// }
}
