import { DataOrigin } from 'data/editor-data';
import { Widget } from 'editor-view/widget/widget';
import './inspector.scss';

export abstract class Inspector extends Widget {
	protected headerElement: HTMLElement;
	protected titleElement: HTMLElement;

	public get title() { return this.titleElement.textContent; }
	public set title(value: string) { this.titleElement.textContent = value; }

	protected contentElement: HTMLElement;
	protected selectedObject: PIXI.DisplayObject;

	public init(_game: Phaser.Game, _root: Container) {
		this.classList.add('phred-inspector');

		this.headerElement = this.appendChild(document.createElement('h1'));
		this.titleElement = this.headerElement.appendChild(document.createElement('div'));
		this.titleElement.classList.add('title');

		this.contentElement = this.appendChild(document.createElement('div'));
		this.contentElement.classList.add('content');
	}

	public enable() { }
	public disable() { }

	public abstract selectObject(obj: PIXI.DisplayObject, from: DataOrigin): void;
}
