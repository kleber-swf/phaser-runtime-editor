import { PhaserObjectType } from 'data/phaser-data';
import './tree-node.scss';

const SELECTED_CLASS = 'selected';
const COLLAPSED_CLASS = 'collapsed';

const COLLAPSED_ICON_CLASS = 'fa-caret-right';
const EXPANDED_ICON_CLASS = 'fa-caret-down';

export class TreeNode extends HTMLElement {
	public static readonly tagName: string = 'phed-tree-node';

	public obj: PIXI.DisplayObject;
	private label: HTMLElement;
	private collapseIcon: HTMLElement;
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
		head.onclick = this.onClick.bind(this);

		this.collapseIcon = head.appendChild(document.createElement('i'));
		this.collapseIcon.classList.add('fas', 'collapse-icon');
		if (obj.children?.length) {
			this.collapseIcon.classList.add(EXPANDED_ICON_CLASS);
			this.collapseIcon.onclick = this.onCollapseIconClick.bind(this);
		}

		const icon = head.appendChild(document.createElement('i'));
		icon.classList.add('fas', 'node-icon', type.icon);

		this.label = head.appendChild(document.createElement('div'));
		this.label.classList.add('node-name');

		this.updateTitle(type, obj.name);
		this.updateObjectVisibility(obj.visible);
	}

	public addChildrenContainer() {
		const container = this.appendChild(document.createElement('div'));
		container.classList.add('node-children');
		return container;
	}

	private onClick() { if (this.onNodeSelect) this.onNodeSelect(this); }

	public select() { this.classList.add(SELECTED_CLASS); }
	public clearSelection() { this.classList.remove(SELECTED_CLASS); }

	private _isCollapsed = false;

	public onCollapseIconClick(e: Event) {
		if (this._isCollapsed) this.expand();
		else this.collapse();
		e.stopImmediatePropagation();
	}

	public collapse() {
		this._isCollapsed = true;
		this.classList.add(COLLAPSED_CLASS);
		this.collapseIcon.classList.remove(EXPANDED_ICON_CLASS);
		this.collapseIcon.classList.add(COLLAPSED_ICON_CLASS);
	}

	public expand() {
		this._isCollapsed = false;
		this.classList.remove(COLLAPSED_CLASS);
		this.collapseIcon.classList.remove(COLLAPSED_ICON_CLASS);
		this.collapseIcon.classList.add(EXPANDED_ICON_CLASS);
	}

}

customElements.define(TreeNode.tagName, TreeNode);
