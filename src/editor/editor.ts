import { ActionsToolbar } from './actions/actions-toolbar';
import './editor.scss';
import { Panel } from './panel/panel';
import { Widget } from './widget/widget';


export class Editor extends Widget {
	public static readonly tagName: string = 'phred-editor';

	private _game: Phaser.Game;
	private actions: ActionsToolbar;
	private gameContainer: HTMLElement;
	private leftPanel: Panel;
	private rightPanel: Panel;

	public connectedCallback() {
		super.connectedCallback();

		const script = document.createElement('script');
		script.src = 'https://kit.fontawesome.com/7ba4e59e46.js';
		script.crossOrigin = 'anonymous';
		document.head.appendChild(script);

		this.leftPanel = document.createElement(Panel.tagName) as Panel;
		this.leftPanel.classList.add('left', 'small');
		this.appendChild(this.leftPanel);

		const content = document.createElement('div');
		content.classList.add('phred-content');
		this.appendChild(content);

		this.actions = document.createElement(ActionsToolbar.tagName) as ActionsToolbar;
		content.appendChild(this.actions);

		this.gameContainer = document.createElement('div');
		this.gameContainer.classList.add('phred-game-container');
		content.appendChild(this.gameContainer);

		this.rightPanel = document.createElement(Panel.tagName) as Panel;
		this.rightPanel.classList.add('right', 'large');
		this.appendChild(this.rightPanel);
	}

	public setup(game: Phaser.Game, root: PIXI.DisplayObject | Phaser.Stage) {
		if (game) {
			const el = game.canvas.parentElement;
			el.classList.add('phred-game');
			this.gameContainer.appendChild(el);
		} else if (this._game) {
			const el = this._game.canvas.parentElement;
			el.classList.remove('phred-game');
			this.gameContainer.removeChild(el);
		}
		this._game = game;
		// this.objectTree.setContent(root);
	}

	public selectObject(obj: PIXI.DisplayObject) {
		// this.properties.selectObject(obj);
		// this.objectTree.selectObject(obj);
	}
}

customElements.define(Editor.tagName, Editor);
