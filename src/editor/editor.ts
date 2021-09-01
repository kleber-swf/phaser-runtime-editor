import { ActionsToolbar } from './actions/actions-toolbar';
import './editor.scss';
import { Panel } from './panel/panel';
import { PropertiesInspector } from './properties/inspector/properties-inspector';
import { Widget } from './widget/widget';


export class Editor extends Widget {
	public static readonly tagName: string = 'phred-editor';

	private _game: Phaser.Game;
	private actions: ActionsToolbar;
	private gameContainer: HTMLElement;
	private panels: Panel[] = [];

	public connectedCallback() {
		super.connectedCallback();

		const script = document.createElement('script');
		script.src = 'https://kit.fontawesome.com/7ba4e59e46.js';
		script.crossOrigin = 'anonymous';
		document.head.appendChild(script);

		const leftPanel = this.appendChild(document.createElement(Panel.tagName) as Panel);
		leftPanel.classList.add('left', 'small');
		this.panels.push(leftPanel);

		const content = this.appendChild(document.createElement('div'));
		content.classList.add('phred-content');

		this.actions = document.createElement(ActionsToolbar.tagName) as ActionsToolbar;
		content.appendChild(this.actions);

		this.gameContainer = document.createElement('div');
		this.gameContainer.classList.add('phred-game-container');
		content.appendChild(this.gameContainer);

		const rightPanel = this.appendChild(document.createElement(Panel.tagName) as Panel);
		rightPanel.classList.add('right', 'large');
		this.panels.push(rightPanel);

		const props = document.createElement(PropertiesInspector.tagName) as PropertiesInspector;
		rightPanel.addInspector(props);
	}

	public setup(game: Phaser.Game, group: PIXI.DisplayObjectContainer | Phaser.Stage) {
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
	}

	public selectObject(obj: PIXI.DisplayObject) {
		this.panels.forEach(panel => panel.selectObject(obj));
	}
}

customElements.define(Editor.tagName, Editor);
