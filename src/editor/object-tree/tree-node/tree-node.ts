import { PhaserData, PhaserObjectType } from 'data/phaser-data';
import './tree-node.scss';

export class TreeNode extends HTMLElement {
	public static readonly tagName: string = 'phed-tree-node';
	public obj: PIXI.DisplayObject;
	public onNodeSelect: (node: TreeNode) => void;

	public setContent(obj: PIXI.DisplayObject, type: PhaserObjectType) {
		this.obj = obj;
		const head = document.createElement('div');
		head.classList.add('node-head');
		head.onclick = this.select.bind(this);
		this.appendChild(head);

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

	public select() {
		this.classList.add('selected');
		if (this.onNodeSelect) this.onNodeSelect(this);
	}

	public clearSelection() { this.classList.remove('selected'); }
}

customElements.define(TreeNode.tagName, TreeNode);
