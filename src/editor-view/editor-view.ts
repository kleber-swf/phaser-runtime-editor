import { Editor } from 'core/editor';
import { DataOrigin } from 'data/editor-data';
import { ActionsToolbar } from './actions/actions-toolbar';
import './editor-view.scss';
import { ObjectTreeInspector } from './object-tree/inspector/object-tree-inspector';
import { Panel } from './panel/panel';
import { PropertiesInspector } from './properties/inspector/properties-inspector';
import { Widget } from './widget/widget';

export class EditorView extends Widget {
	public static readonly tagName: string = 'phred-editor-view';

	private _game: Phaser.Game;
	private actions: ActionsToolbar;
	private gameContainer: HTMLElement;
	private panels: Panel[] = [];

	public connectedCallback() {
		super.connectedCallback();

		Editor.data.onSelectedObjectChanged.add(this.selectObject, this);

		const leftPanel = this.appendChild(document.createElement(Panel.tagName) as Panel);
		leftPanel.classList.add('left', 'small');
		this.panels.push(leftPanel);

		const content = this.appendChild(document.createElement('div'));
		content.classList.add('phred-content');

		this.actions = document.createElement(ActionsToolbar.tagName) as ActionsToolbar;
		content.appendChild(this.actions);

		this.gameContainer = document.createElement('div');
		this.gameContainer.id = 'phred-game-container';
		this.gameContainer.classList.add('phred-game-container');
		content.appendChild(this.gameContainer);

		const rightPanel = this.appendChild(document.createElement(Panel.tagName) as Panel);
		rightPanel.classList.add('right', 'large');
		this.panels.push(rightPanel);

		const tree = document.createElement(ObjectTreeInspector.tagName) as ObjectTreeInspector;
		tree.id = 'phed-object-tree';
		leftPanel.addInspector(tree);

		const props = document.createElement(PropertiesInspector.tagName) as PropertiesInspector;
		props.id = 'phred-properties-panel';
		rightPanel.addInspector(props);
	}

	public setup(game: Phaser.Game, group: Container) {
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
		(document.querySelector('#phed-object-tree') as ObjectTreeInspector)
			.setContent(group);
	}

	public selectObject(_: DataOrigin, obj: PIXI.DisplayObject) {
		this.panels.forEach(panel => panel.selectObject(obj));
	}
}

customElements.define(EditorView.tagName, EditorView);
