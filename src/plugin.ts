import { EditorWindow } from 'editor.window';
import { Editor } from 'index';
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
		this.editorWindow.onshow = this.onEditorShow.bind(this);
		this.editorWindow.onhide = this.onEditorHide.bind(this);
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

	private onEditorShow() {
		(this as any).postUpdate = this._postUpdate.bind(this);
		this.hasPostUpdate = true;
	}

	private onEditorHide() {
		this.hasPostUpdate = false;
		(this as any).postUpdate = null;
	}

	private _postUpdate() {
		Editor.data.dispatchScheduledEvents();
	}
}

(Phaser.Plugin as any).RuntimeEditor = Plugin;
