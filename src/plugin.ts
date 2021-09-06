import { DisabledUI } from 'disabled/disabled-ui';
import { EditorWindow } from 'editor.window';
import Phaser from 'phaser-ce';

export class Plugin extends Phaser.Plugin {
	private readonly disabledUI: DisabledUI;
	private readonly editorWindow: EditorWindow;

	public constructor(game: Phaser.Game) {
		super(game, game.plugins);

		this.editorWindow = new EditorWindow();
		this.disabledUI = new DisabledUI();
		this.disabledUI.onclick = this.enableEditor.bind(this);
	}

	private enableEditor() {
		this.editorWindow.show(this);
	}
}

(Phaser.Plugin as any).RuntimeEditor = Plugin;
