import { PhaserObjectType } from 'data/phaser-data';
import './tree-node.scss';

export class TreeNode extends HTMLElement {
	public static readonly tagName: string = 'phed-tree-node';

	public obj: PIXI.DisplayObject;
	private label: HTMLElement;
	public onNodeSelect: (node: TreeNode) => void;

	public updateTitle(type: PhaserObjectType, value: string) {
		if (this.obj) this.label.textContent = value?.length > 0 ? value : type.name;
	}

	public updateObjectVisibility(value: boolean) {
		if (!this.obj) return;
		if (value) this.classList.remove('object-invisible');
		else this.classList.add('object-invisible');
	}

	public setContent(obj: PIXI.DisplayObject, type: PhaserObjectType) {
		this.obj = obj;
		const head = this.appendChild(document.createElement('div'));
		head.classList.add('node-head');
		head.onclick = this.select.bind(this);

		const collapseIcon = head.appendChild(document.createElement('i'));
		collapseIcon.classList.add('fas', 'fa-caret-right', 'collapse-icon');

		const icon = head.appendChild(document.createElement('i'));
		icon.classList.add('fas', 'node-icon', type.icon);

		const label = head.appendChild(this.label = document.createElement('div'));
		label.classList.add('node-name');
		this.updateTitle(type, obj.name);
		this.updateObjectVisibility(obj.visible);
	}

	public addChildrenContainer() {
		const container = this.appendChild(document.createElement('div'));
		container.classList.add('node-children');
		return container;
	}

	public select(e?: Event) {
		this.classList.add('selected');
		if (e && this.onNodeSelect) this.onNodeSelect(this);
	}

	public clearSelection() { this.classList.remove('selected'); }
}

customElements.define(TreeNode.tagName, TreeNode);
