import { PhaserData } from 'data/phaser-data';
import './tree-item.scss';

export class TreeItem extends HTMLElement {
	public static readonly tagName: string = 'phed-tree-item';

	public setContent(obj: PIXI.DisplayObject) {
		const head = document.createElement('div');
		head.classList.add('item-head');
		this.appendChild(head);
		
		const type = PhaserData.getType(obj.type);
		const icon = document.createElement('i');
		icon.classList.add('fas', 'item-icon', type.icon);
		head.appendChild(icon);

		const label = document.createElement('div');
		label.classList.add('item-name');
		label.textContent = type.name;
		head.appendChild(label);
	}

	public addChildrenContainer() {
		const container = document.createElement('div');
		container.classList.add('item-children');
		this.appendChild(container);
		return container;
	}
}

customElements.define(TreeItem.tagName, TreeItem);
