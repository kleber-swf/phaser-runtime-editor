import { DisabledUI } from 'disabled/disabled-ui';
import { EditorWindow } from 'editor.window';
import Phaser from 'phaser-ce';

export class Plugin extends Phaser.Plugin {
	private readonly editorWindow: EditorWindow;

	private root: Container;
	private refImage?: PIXI.Sprite;

	public constructor(game: Phaser.Game, root?: Container, refImage?: PIXI.Sprite) {
		super(game, game.plugins);
		this.root = root;
		this.refImage = refImage
		this.insertHead();

		this.editorWindow = new EditorWindow(game, root, refImage);
		this.editorWindow.start();
	}

	private insertHead() {
		const head = document.head;
		const script = document.createElement('script');
		script.src = 'https://kit.fontawesome.com/7ba4e59e46.js';
		script.crossOrigin = 'anonymous';
		head.appendChild(script);

		let link = head.appendChild(document.createElement('link'));
		link.rel = 'preconnect';
		link.href = 'https://fonts.googleapis.com';

		link = head.appendChild(document.createElement('link'));
		link.rel = 'preconnect';
		link.href = 'https://fonts.gstatic.com';
		link.crossOrigin = 'true';

		link = head.appendChild(document.createElement('link'));
		link.rel = 'stylesheet';
		link.href = 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap';
	}
}

(Phaser.Plugin as any).RuntimeEditor = Plugin;
