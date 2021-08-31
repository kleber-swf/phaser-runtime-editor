import { ActionsToolbar } from './actions/actions-toolbar';
import { PropertiesToolbar } from './properties/toolbar/properties-toolbar';
import { Widget } from './widget/widget';

import './editor.scss';
import { ObjectTreeToolbar } from './object-tree/toolbar/object-tree-toolbar';

export class Editor extends Widget {
	public static readonly tagName: string = 'phred-editor';

	private _game: Phaser.Game;
	private actions: ActionsToolbar;
	private gameContainer: HTMLElement;
	private properties: PropertiesToolbar;
	private objectTree: ObjectTreeToolbar;

	public connectedCallback() {
		super.connectedCallback();

		this.objectTree = document.createElement(ObjectTreeToolbar.tagName) as ObjectTreeToolbar;
		this.appendChild(this.objectTree);

		const content = document.createElement('div');
		content.classList.add('phred-content');
		this.appendChild(content);

		this.actions = document.createElement(ActionsToolbar.tagName) as ActionsToolbar;
		content.appendChild(this.actions);

		this.gameContainer = document.createElement('div');
		this.gameContainer.classList.add('phred-game-container');
		content.appendChild(this.gameContainer);

		this.properties = document.createElement(PropertiesToolbar.tagName) as PropertiesToolbar;
		this.appendChild(this.properties);
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
		this.objectTree.setContent(root);
	}

	public selectObject(obj: PIXI.DisplayObject) {
		this.properties.selectObject(obj);
		this.objectTree.selectObject(obj);
	}
}

customElements.define(Editor.tagName, Editor);
