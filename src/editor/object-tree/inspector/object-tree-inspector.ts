import { Inspector } from 'editor/inspector/inspector';
import { TreeNode } from '../tree-node/tree-node';
import './object-tree-inspector.scss';

export class ObjectTreeInspector extends Inspector {
	public static readonly tagName: string = 'phed-object-tree-inspector';

	public connectedCallback() {
		super.connectedCallback();
		this.title = 'Objects';
	}

	public setContent(root: PIXI.DisplayObject | Phaser.Stage) {
		for (let i = 0, n = root.children.length; i < n; i++)
			this.createItem(root.children[i], this.content, 0);
	}

	private createItem(obj: PIXI.DisplayObject, parent: HTMLElement, level: number) {
		const item = document.createElement(TreeNode.tagName) as TreeNode;
		item.classList.add(`level-${level}`);
		item.setContent(obj);
		parent.appendChild(item);

		if (!('children' in obj)) return;
		level = level + 1;
		for (let i = 0, n = obj.children.length; i < n; i++) {
			const container = item.addChildrenContainer();
			this.createItem(obj.children[i], container, level);
		}
	}

	public selectObject(obj: PIXI.DisplayObject) {
		console.log(obj);
	}
}

customElements.define(ObjectTreeInspector.tagName, ObjectTreeInspector);
