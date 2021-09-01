import { PhaserData } from 'data/phaser-data';
import './tree-node.scss';

export class TreeNode extends HTMLElement {
	public static readonly tagName: string = 'phed-tree-node';

	public setContent(obj: PIXI.DisplayObject) {
		const head = document.createElement('div');
		head.classList.add('node-head');
		this.appendChild(head);

		const type = PhaserData.getType(obj.type);
		const icon = document.createElement('i');
		icon.classList.add('fas', 'node-icon', type.icon);
		head.appendChild(icon);

		const label = document.createElement('div');
		label.classList.add('node-name');
		label.textContent = obj.name && obj.name.length > 0 ? obj.name : type.name;
		head.appendChild(label);
	}

	public addChildrenContainer() {
		const container = document.createElement('div');
		container.classList.add('node-children');
		this.appendChild(container);
		return container;
	}
}

customElements.define(TreeNode.tagName, TreeNode);
