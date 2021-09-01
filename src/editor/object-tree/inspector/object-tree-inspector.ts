import { Inspector } from 'editor/inspector/inspector';
import { ObjectTreeModel } from '../model/object-tree-model';
import { TreeNode } from '../tree-node/tree-node';
import './object-tree-inspector.scss';

export class ObjectTreeInspector extends Inspector {
	public static readonly tagName: string = 'phed-object-tree-inspector';
	private readonly model: ObjectTreeModel = new ObjectTreeModel();

	public connectedCallback() {
		super.connectedCallback();
		this.title = 'Objects';
	}

	public setContent(root: PIXI.DisplayObjectContainer | Phaser.Stage) {
		this.model.create(root);
		for (let i = 0, n = root.children.length; i < n; i++)
			this.createNode(root.children[i], this.content, this.model);
	}

	private createNode(obj: PIXI.DisplayObject, parent: HTMLElement, model:ObjectTreeModel) {
		const m = model.getById(obj.__instanceId);
		if (!m) throw new Error(`Model not found for ${obj.__instanceId}`);

		const node = document.createElement(TreeNode.tagName) as TreeNode;
		node.classList.add(`level-${m.level}`);
		node.setContent(obj);
		parent.appendChild(node);
		
		m.node = node;

		if (!('children' in obj)) return;
		for (let i = 0, n = obj.children.length; i < n; i++) {
			const container = node.addChildrenContainer();
			this.createNode(obj.children[i], container, model);
		}
	}

	public selectObject(obj: PIXI.DisplayObject) {
		console.log(obj);
	}
}

customElements.define(ObjectTreeInspector.tagName, ObjectTreeInspector);
