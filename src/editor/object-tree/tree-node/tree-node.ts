import { PhaserObjectType } from 'data/phaser-data';
import { ObjectMapItemModel } from '../model/object-tree-model';
import './tree-node.scss';

const SELECTED_CLASS = 'selected';
const COLLAPSED_CLASS = 'collapsed';

export class TreeNode extends HTMLElement {
	public static readonly tagName: string = 'phed-tree-node';

	public model: ObjectMapItemModel;
	private label: HTMLElement;
	private collapseIcon: HTMLElement;
	public onNodeSelect: (node: TreeNode) => void;
	public onCollapseStateChanged: (node: TreeNode, collapsed: boolean, all: boolean) => void;

	public updateTitle(type: PhaserObjectType, value: string) {
		this.label.textContent = value?.length > 0 ? value : type.name;
	}

	public updateObjectVisibility(value: boolean) {
		if (value) this.classList.remove('object-invisible');
		else this.classList.add('object-invisible');
	}

	public setContent(model: ObjectMapItemModel) {
		this.model = model;
		const head = this.appendChild(document.createElement('div'));
		head.classList.add('node-head');
		head.onclick = this.onClick.bind(this);

		this.collapseIcon = head.appendChild(document.createElement('i'));
		this.collapseIcon.classList.add('fas', 'collapse-icon');
		if (model.obj.children?.length) {
			this.collapseIcon.classList.add('fa-caret-down');
			this.collapseIcon.onclick = this.onCollapseIconClick.bind(this);
		}

		const icon = head.appendChild(document.createElement('i'));
		icon.classList.add('fas', 'node-icon', model.type.icon);

		this.label = head.appendChild(document.createElement('div'));
		this.label.classList.add('node-name');

		this.updateTitle(model.type, model.obj.name);
		this.updateObjectVisibility(model.obj.visible);
	}

	public addChildrenContainer() {
		const container = this.appendChild(document.createElement('div'));
		container.classList.add('node-children');
		return container;
	}

	private onClick() { if (this.onNodeSelect) this.onNodeSelect(this); }

	public select() { this.classList.add(SELECTED_CLASS); }
	public clearSelection() { this.classList.remove(SELECTED_CLASS); }

	public onCollapseIconClick(e: MouseEvent) {
		console.log('collapse icon click')
		if (this.model.collapsed) this.expand();
		else this.collapse();
		e.stopImmediatePropagation();
		if (this.onCollapseStateChanged)
			this.onCollapseStateChanged(this, this.model.collapsed, e.altKey);
	}

	public collapse() {
		this.model.collapsed = true;
		this.classList.add(COLLAPSED_CLASS);
	}

	public expand() {
		console.trace('EXPAND');
		this.model.collapsed = false;
		this.classList.remove(COLLAPSED_CLASS);
	}
}

customElements.define(TreeNode.tagName, TreeNode);
