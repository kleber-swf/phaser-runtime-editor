import { Data, DataOrigin } from 'data/data';
import { Inspector } from 'editor/inspector/inspector';
import { ObjectMapItemModel, ObjectTreeModel } from '../model/object-tree-model';
import { TreeNode } from '../tree-node/tree-node';
import './object-tree-inspector.scss';

export class ObjectTreeInspector extends Inspector {
	public static readonly tagName: string = 'phed-object-tree-inspector';
	private readonly model: ObjectTreeModel = new ObjectTreeModel();

	public connectedCallback() {
		super.connectedCallback();
		this.title = 'Objects';
		Data.addPropertyChangedListener(DataOrigin.INSPECTOR, this.onPropertyChanged.bind(this));
	}

	private onPropertyChanged(property: string, value: string) {
		if (!(property === 'name' && this._lastSelectedModel)) return;
		this._lastSelectedModel.node.updateTitle(this._lastSelectedModel.type, value);
	}

	public setContent(root: PIXI.DisplayObjectContainer | Phaser.Stage) {
		this.model.create(root);
		for (let i = 0, n = root.children.length; i < n; i++)
			this.createNode(root.children[i], this.content, this.model);
	}

	private createNode(obj: PIXI.DisplayObject, parent: HTMLElement, model: ObjectTreeModel) {
		const m = model.getById(obj.__instanceId);
		if (!m) throw new Error(`Model not found for ${obj.__instanceId}`);

		const node = document.createElement(TreeNode.tagName) as TreeNode;
		node.classList.add(`level-${m.level}`);
		node.onNodeSelect = this.onNodeSelected.bind(this);
		node.setContent(obj, m.type);
		parent.appendChild(node);

		m.node = node;

		if (!('children' in obj)) return;
		for (let i = 0, n = obj.children.length; i < n; i++) {
			const container = node.addChildrenContainer();
			this.createNode(obj.children[i], container, model);
		}
	}

	private onNodeSelected(node: TreeNode) {
		if (this._lastSelectedModel) this._lastSelectedModel.node.clearSelection();
		this._lastSelectedModel = this.model.getById(node.obj.__instanceId);
		Data.selectObject(node.obj, DataOrigin.INSPECTOR);
	}

	private _lastSelectedModel: ObjectMapItemModel;

	public selectObject(obj: PIXI.DisplayObject) {
		this._lastSelectedModel?.node.clearSelection();
		this._lastSelectedModel = null;
		if (!obj) return;
		this._lastSelectedModel = this.model.getById(obj.__instanceId);
		this._lastSelectedModel.node.select();
	}
}

customElements.define(ObjectTreeInspector.tagName, ObjectTreeInspector);
