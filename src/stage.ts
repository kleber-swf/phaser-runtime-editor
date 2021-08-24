import { EditorView } from './editor/editor.view';
import { ToolBar } from './ui/toolbar';

export class Stage extends Phaser.Group {
	constructor(game: Phaser.Game, container: Phaser.Group | Phaser.Stage, parent: Phaser.Group | Phaser.Stage) {
		super(game, parent);

		const scale = game.scale.scaleFactor;
		this.scale.copyFrom(scale);
		game.scale.onSizeChange.add(() => this.scale.copyFrom(game.scale.scaleFactor));

		const editor = new EditorView(game, container, this);
		const toolbar = new ToolBar(game, this);
	}
}