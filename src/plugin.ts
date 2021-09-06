import { DisabledUI } from 'disabled/disabled-ui';
import { EditorWindow } from 'editor.window';
import Phaser from 'phaser-ce';

export class Plugin extends Phaser.Plugin {
	private readonly disabledUI: DisabledUI;
	private readonly editorWindow: EditorWindow;

	public constructor(game: Phaser.Game) {
		super(game, game.plugins);

		// this.disabledUI = new DisabledUI();
		this.editorWindow = new EditorWindow(this);
	}
}

(Phaser.Plugin as any).RuntimeEditor = Plugin;
