import { Widget } from 'editor-view/widget/widget';
import './inspector.scss';

export abstract class Inspector extends Widget {
	private titleElement: HTMLElement;
	public get title() { return this.titleElement.textContent; }
	public set title(value: string) { this.titleElement.textContent = value; }

	protected content: HTMLElement;
	protected selectedObject: PIXI.DisplayObject;

	public setup(_game: Phaser.Game, _root: Container) {
		this.classList.add('phred-inspector');
	
		this.titleElement = this.appendChild(document.createElement('div'));
		this.titleElement.classList.add('title');
	
		this.content = this.appendChild(document.createElement('div'));
		this.content.classList.add('content');
	}

	public abstract selectObject(obj: PIXI.DisplayObject): void;
}
