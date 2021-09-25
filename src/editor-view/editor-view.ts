import { ComponentTags } from 'component-tags';
import { ActionHandler } from 'core/action-handler';
import { Editor } from 'core/editor';
import { DataOrigin } from 'data/editor-data';
import { PluginConfig } from 'plugin';
import { ActionsToolbar } from './actions/actions-toolbar';
import './editor-view.scss';
import { ObjectTreeInspector } from './object-tree/inspector/object-tree-inspector';
import { Panel } from './panel/panel';
import { PropertiesInspector } from './properties/inspector/properties-inspector';
import { Widget } from './widget/widget';

export class EditorView extends Widget {
	private game: Phaser.Game;
	private gameParentElement: HTMLElement;
	private gameContainer: HTMLElement;
	private actions: ActionsToolbar;
	private panels: Panel[] = [];

	private _initialized = false;
	private _enabled = false;

	private init(game: Phaser.Game, config: PluginConfig) {
		this.game = game;
		this._initialized = true;
		Editor.data.onSelectedObjectChanged.add(this.selectObject, this);
		Editor.actions.addContainer(ComponentTags.EditorView, this);
		this.createElements();
		this.panels.forEach(panel => panel.init(game, config));
	}

	public setupActions(_actions: ActionHandler) { }

	private createElements() {
		const leftPanel = this.appendChild(document.createElement(ComponentTags.Panel) as Panel);
		leftPanel.setSide('left');
		leftPanel.classList.add('small');
		this.panels.push(leftPanel);

		const content = this.appendChild(document.createElement('div'));
		content.classList.add('phred-content');

		this.actions = document.createElement(ComponentTags.ActionsToolbar) as ActionsToolbar;
		content.appendChild(this.actions);
		this.actions.init();

		this.gameContainer = document.createElement('div');
		this.gameContainer.id = 'phred-game-container';
		this.gameContainer.classList.add('phred-game-container');
		content.appendChild(this.gameContainer);

		const rightPanel = this.appendChild(document.createElement(ComponentTags.Panel) as Panel);
		rightPanel.setSide('right');
		rightPanel.classList.add('large');
		this.panels.push(rightPanel);

		const tree = document.createElement(ComponentTags.ObjectTreeInspector) as ObjectTreeInspector;
		tree.id = 'phred-object-tree';
		leftPanel.addInspector(tree);

		const props = document.createElement(ComponentTags.PropertiesInspector) as PropertiesInspector;
		props.id = 'phred-properties-panel';
		rightPanel.addInspector(props);
	}

	public enable(game: Phaser.Game, config: PluginConfig) {
		if (this._enabled) return;
		this._enabled = true;
		if (!this._initialized) this.init(game, config);

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

	public selectObject(from: DataOrigin, obj: PIXI.DisplayObject) {
		this.panels.forEach(panel => panel.selectObject(obj, from));
	}
}

customElements.define(ComponentTags.EditorView, EditorView);
