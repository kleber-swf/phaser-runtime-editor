import { Action } from 'core/action-handler';
import { DataOrigin } from 'data/editor-data';
import { ActionButton } from 'editor-view/actions/button/action-button';
import { Widget } from 'editor-view/widget/widget';
import { PluginConfig, Side } from 'plugin.model';
import './inspector.scss';

export abstract class Inspector extends Widget {
	protected headerElement: HTMLElement;
	protected titleElement: HTMLElement;

	public get title() { return this.titleElement.textContent; }
	public set title(value: string) { this.titleElement.textContent = value; }

	protected contentElement: HTMLElement;
	protected selectedObject: PIXI.DisplayObject;

	private leftActionsContainer: HTMLElement;
	private rightActionsContainer: HTMLElement;

	public init(_game: Phaser.Game, _side: Side) {
		this.classList.add('phred-inspector');

		const header = this.headerElement = this.appendChild(document.createElement('h1'));
		header.classList.add('actions-toolbar');

		this.leftActionsContainer = header.appendChild(document.createElement('div'));
		this.leftActionsContainer.classList.add('actions', 'left');

		this.titleElement = header.appendChild(document.createElement('div'));
		this.titleElement.classList.add('title');

		header.appendChild(document.createElement('div')).classList.add('spacer');

		this.rightActionsContainer = header.appendChild(document.createElement('div'));
		this.rightActionsContainer.classList.add('actions', 'right');

		this.contentElement = this.appendChild(document.createElement('div'));
		this.contentElement.classList.add('content');
	}

	public enable(_config: PluginConfig) { }

	public disable() { }

	public addAction(action: Action, side: Side, buttonTagName = ActionButton.tagName) {
		const container = side === 'left' ? this.leftActionsContainer : this.rightActionsContainer;
		const button = this.createButton(action, buttonTagName);
		container.appendChild(button);
	}

	private createButton(action: Action, buttonTagName: string) {
		const btn = document.createElement(buttonTagName) as ActionButton;
		btn.setAction(action);
		return btn;
	}

	public abstract selectObject(obj: PIXI.DisplayObject, from: DataOrigin): void;
}
