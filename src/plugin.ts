import { EditorWindow } from 'editor.window';
import Phaser from 'phaser-ce';
import './plugin.scss';

export class Plugin extends Phaser.Plugin {
	private readonly editorWindow: EditorWindow;

	public constructor(game: Phaser.Game) {
		super(game, game.plugins);
		// this.showDisabledInterface();
		this.editorWindow = new EditorWindow(this);
	}
}

(Phaser.Plugin as any).RuntimeEditor = Plugin;
