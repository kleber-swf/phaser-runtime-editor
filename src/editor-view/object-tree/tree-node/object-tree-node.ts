import { PhaserObjectType } from 'data/phaser-meta';
import { ObjectTreeNodeModel } from '../model/object-tree-model';
import './object-tree-node.scss';

const SELECTED_CLASS = 'selected';
const COLLAPSED_CLASS = 'collapsed';

export class ObjectTreeNode extends HTMLElement {
	public static readonly tagName = 'phred-object-tree-node';

	public model: ObjectTreeNodeModel;
	private label: HTMLElement;
	private collapseIcon: HTMLElement;
	public onNodeSelect: (node: ObjectTreeNode) => void;
	public onCollapseStateChanged: (node: ObjectTreeNode, collapsed: boolean, all: boolean) => void;

	public set locked(value: boolean) {
		this.classList.addOrRemove('locked', value);
	}

	public updateTitle(type: PhaserObjectType, value: string) {
		this.label.textContent = value?.length > 0 ? value : type.name;
	}

	public get title() { return this.label.textContent; }

	public updateObjectVisibility(value: boolean) {
		this.classList.addOrRemove('object-invisible', !value);
	}

	public setContent(model: ObjectTreeNodeModel) {
		this.model = model;
		const head = this.appendChild(document.createElement('div'));
		head.classList.add('node-head');
		head.onclick = this.onClick.bind(this);

		this.collapseIcon = head.appendChild(document.createElement('i'));
		this.collapseIcon.classList.add('fas', 'collapse-icon');
		if (!model.isLeaf) {
			this.collapseIcon.classList.add('fa-caret-down');
			this.collapseIcon.onclick = this.onCollapseIconClick.bind(this);
		}

		const icon = head.appendChild(document.createElement('i'));
		icon.classList.add('fas', 'node-icon', model.type.icon);

		this.label = head.appendChild(document.createElement('div'));
		this.label.classList.add('node-name');
		this.locked = model.obj.__locked;

		// head.appendChild(document.createElement('div')).classList.add('spacer');
		head.appendChild(document.createElement('i')).classList.add('fas', 'fa-lock');

		this.updateTitle(model.type, model.obj.name);
		this.updateObjectVisibility(model.obj.visible);
	}

	public addChildrenContainer() {
		const container = this.appendChild(document.createElement('div'));
		container.classList.add('node-children');
		return container;
	}

	private onClick() { if (this.onNodeSelect) this.onNodeSelect(this); }

	public select(focus: boolean) {
		this.classList.add(SELECTED_CLASS);
		if (focus) this.focus();
	}

	public focus() { this.collapseIcon.scrollIntoView(); }

	public clearSelection() { this.classList.remove(SELECTED_CLASS); }

	public onCollapseIconClick(e: MouseEvent) {
		if (this.model.collapsed) this.expand();
		else this.collapse();
		e.stopImmediatePropagation();
		if (this.onCollapseStateChanged) {
			this.onCollapseStateChanged(this, this.model.collapsed, e.altKey);
		}
	}

	public collapse() {
		this.model.collapsed = true;
		this.classList.add(COLLAPSED_CLASS);
	}

	public expand() {
		this.model.collapsed = false;
		this.classList.remove(COLLAPSED_CLASS);
	}
}

customElements.define(ObjectTreeNode.tagName, ObjectTreeNode);
