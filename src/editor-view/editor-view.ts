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

	private actions: ActionsToolbar;
	private gameContainer: HTMLElement;
	private panels: Panel[] = [];

	private _initialized = false;
	private _enabled = false;

	private game: Phaser.Game;
	private gameParentElement: HTMLElement;

	private init(game: Phaser.Game, root: Container) {
		this.game = game;
		this._initialized = true;
		Editor.data.onSelectedObjectChanged.add(this.selectObject, this);

		this.createElements();

		Editor.actions.addContainer(EditorView.tagName, this);

		// initialize panels
		this.panels.forEach(panel => panel.init(game, root));
	}

	private createElements() {
		const leftPanel = this.appendChild(document.createElement(Panel.tagName) as Panel);
		leftPanel.classList.add('left', 'small');
		this.panels.push(leftPanel);

		const content = this.appendChild(document.createElement('div'));
		content.classList.add('phred-content');

		this.actions = document.createElement(ActionsToolbar.tagName) as ActionsToolbar;
		content.appendChild(this.actions);
		this.actions.init();

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

	public enable(game: Phaser.Game, root: Container) {
		if (this._enabled) return;
		this._enabled = true;
		if (!this._initialized) this.init(game, root);

		this.panels.forEach(panel => panel.enable());
		this.addGameToContainer(game);
		document.body.appendChild(this);
	}

	public disable() {
		if (!this._enabled) return;
		this._enabled = false;
		this.returnGameToItsParent();
		this.panels.forEach(panel => panel.enable());
		this.parentElement.removeChild(this);
	}

	private addGameToContainer(game: Phaser.Game) {
		const el = game.canvas.parentElement;
		this.gameParentElement = el.parentElement;
		el.classList.add('phred-game');
		this.gameContainer.appendChild(el);
	}

	private returnGameToItsParent() {
		const el = this.game.canvas.parentElement;
		el.classList.remove('phred-game');
		this.gameParentElement.appendChild(el);
		this.gameParentElement = null;
	}

	public selectObject(_: DataOrigin, obj: PIXI.DisplayObject) {
		this.panels.forEach(panel => panel.selectObject(obj));
	}
}

customElements.define(EditorView.tagName, EditorView);
