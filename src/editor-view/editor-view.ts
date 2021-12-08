import { ActionHandler } from 'core/action-handler';
import { Editor } from 'core/editor';
import { DataOrigin } from 'data/editor-data';
import { PluginConfig } from 'plugin.model';
import { GameContainer } from '../scene-view/game-container/game-container';
import { ActionsToolbar } from './actions/actions-toolbar';
import './editor-view.scss';
import { ObjectTreeInspector } from './object-tree/inspector/object-tree-inspector';
import { Panel } from './panel/panel';
import { PropertiesInspector } from './properties/inspector/properties-inspector';
import { Widget } from './widget/widget';

export class EditorView extends Widget {
	public static readonly tagName = 'phred-editor-view';
	private gameContainer: GameContainer;
	private actions: ActionsToolbar;
	private panels: Panel[] = [];

	private _enabled = false;

	public init(game: Phaser.Game) {
		Editor.data.onSelectedObjectChanged.add(this.selectObject, this);
		Editor.actions.addContainer(EditorView.tagName, this);
		this.createElements();
		this.gameContainer.init(game);
		this.panels.forEach(panel => panel.init(game));
	}

	public setupActions(actions: ActionHandler) {
		this.actions.setupActions(actions);
		this.gameContainer.setupActions(actions);
	}

	private createElements() {
		const leftPanel = this.appendChild(document.createElement(Panel.tagName) as Panel);
		leftPanel.setSide('left');
		leftPanel.classList.add('small');
		this.panels.push(leftPanel);

		const content = this.appendChild(document.createElement('div'));
		content.classList.add('phred-content');

		this.actions = document.createElement(ActionsToolbar.tagName) as ActionsToolbar;
		content.appendChild(this.actions);

		this.gameContainer = document.createElement(GameContainer.tagName) as GameContainer;
		content.appendChild(this.gameContainer);

		const rightPanel = this.appendChild(document.createElement(Panel.tagName) as Panel);
		rightPanel.setSide('right');
		rightPanel.classList.add('large');
		this.panels.push(rightPanel);

		const tree = document.createElement(ObjectTreeInspector.tagName) as ObjectTreeInspector;
		tree.id = 'phred-object-tree';
		leftPanel.addInspector(tree);

		const props = document.createElement(PropertiesInspector.tagName) as PropertiesInspector;
		props.id = 'phred-properties-panel';
		rightPanel.addInspector(props);
	}

	public enable(config: PluginConfig) {
		if (this._enabled) return;
		this._enabled = true;

		this.panels.forEach(panel => panel.enable(config));
		this.gameContainer.enable(config);
		this.actions.enable();
		document.body.appendChild(this);
	}

	public disable() {
		if (!this._enabled) return;
		this._enabled = false;
		this.actions.disable();
		this.gameContainer.disable();
		this.panels.forEach(panel => panel.disable());
		this.remove();
	}

	public selectObject(from: DataOrigin, obj: PIXI.DisplayObject) {
		this.panels.forEach(panel => panel.selectObject(obj, from));
	}
}

customElements.define(EditorView.tagName, EditorView);
