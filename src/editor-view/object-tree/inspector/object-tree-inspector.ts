import { Actions } from 'core/actions';
import { Editor } from 'core/editor';
import { DataOrigin } from 'data/editor-data';
import { Inspector } from 'editor-view/inspector/inspector';
import { PluginConfig, Side } from 'plugin.model';
import { LockObjectActionButton } from '../lock-object/lock-object.action-button';
import { ObjectTreeModel, ObjectTreeNodeModel } from '../model/object-tree-model';
import { SearchField } from '../search-field/search-field';
import { ObjectTreeNode } from '../tree-node/object-tree-node';
import './object-tree-inspector.scss';

export class ObjectTreeInspector extends Inspector {
	public static readonly tagName = 'phred-object-tree-inspector';

	private root: Container;
	private readonly model: ObjectTreeModel = new ObjectTreeModel();

	public init(game: Phaser.Game, side: Side) {
		super.init(game, side);
		this.title = 'Objects';

		const el = this.headerElement.appendChild(document.createElement(SearchField.tagName)) as SearchField;
		el.init();
		el.onValueChanged = this.filterContent.bind(this);
		el.onClear = this.onFilterClear.bind(this);

		Editor.data.onPropertyChanged.add(this.onPropertyChanged, this);
		Editor.data.onObjectLocked.add(this.onObjectLocked, this);

		this.addAction(Editor.actions.getAction(Actions.REFRESH_OBJECT_TREE), 'right');
		this.addAction(Editor.actions.getAction(Actions.LOCK_SELECTION), 'right', LockObjectActionButton.tagName);
		this.addAction(Editor.actions.getAction(Actions.SELECT_PARENT), 'right');

		Editor.actions.setActionCommand(
			Actions.REFRESH_OBJECT_TREE,
			() => {
				Editor.data.selectObject(null, DataOrigin.ACTION);
				this.setRoot(this.root);
			}
		);
	}

	public enable(config: PluginConfig) { this.setRoot(config.root); }
	public disable() { this.clear(); }

	private setRoot(root: PIXI.DisplayObjectContainer | Phaser.Stage) {
		this.root = root;
		this.clear();
		this.model.create(root);
		for (let i = 0, n = root.children.length; i < n; i++) {
			this.createNode(root.children[i], this.contentElement, this.model);
		}
	}

	private clear() {
		this.model.empty();

		const emptyContent = this.contentElement.cloneNode(false);
		this.replaceChild(emptyContent, this.contentElement);
		this.contentElement = emptyContent as HTMLElement;
	}

	private createNode(obj: PIXI.DisplayObject, parent: HTMLElement, model: ObjectTreeModel) {
		// if (obj.__locked) return;
		const m = model.getById(obj.__instanceId);
		if (!m) throw new Error(`Model not found for ${obj.__instanceId}`);

		const node = parent.appendChild(document.createElement(ObjectTreeNode.tagName)) as ObjectTreeNode;
		node.classList.add(`level-${m.level}`);

		node.onNodeSelect = this.onNodeSelected.bind(this);
		node.onCollapseStateChanged = this.onNodeCollapseStateChanged.bind(this);
		node.setContent(m);

		m.node = node;

		if (m.isLeaf) return;
		for (let i = 0, n = obj.children.length; i < n; i++) {
			const container = node.addChildrenContainer();
			this.createNode(obj.children[i], container, model);
		}
	}

	private onPropertyChanged(_: DataOrigin, property: string, value: any) {
		if (!this._lastSelectedModel) return;
		if (property === 'name') {
			this._lastSelectedModel.node.updateTitle(this._lastSelectedModel.type, value);
			return;
		}
		if (property === 'visible') {
			this._lastSelectedModel.node.updateObjectVisibility(value);
		}
	}

	private changeCollapseState(model: ObjectTreeNodeModel, collapsed: boolean, all: boolean) {
		model.collapsed = collapsed;
		if (model.isLeaf || !(all && model.obj.children?.length)) return;
		model.obj.children.forEach(child => {
			if (child.__locked) return;
			const n = this.model.getById(child.__instanceId);
			if (collapsed) n.node.collapse();
			else n.node.expand();
			this.changeCollapseState(n, collapsed, true);
		});
	}

	private _lastSelectedModel: ObjectTreeNodeModel;

	public selectObject(obj: PIXI.DisplayObject, from: DataOrigin) {
		this._lastSelectedModel?.node.clearSelection();
		this._lastSelectedModel = null;
		if (!obj) return;
		this._lastSelectedModel = this.model.getById(obj.__instanceId);
		this._lastSelectedModel.node.select(from !== DataOrigin.INSPECTOR);
		this.expandParents(this._lastSelectedModel.parent);
	}

	private expandParents(model: ObjectTreeNodeModel) {
		if (model.collapsed && !model.isLeaf) {
			model.collapsed = false;
			model.node.expand();
		}

		if (model.parent) {
			this.expandParents(model.parent);
		}
	}

	private filterContent(filter: string) {
		this.classList.addOrRemove('filtering', !!filter);
		this.model.filter(filter);
	}

	private onObjectLocked(object: PIXI.DisplayObject) {
		if (!object) return;
		let model: ObjectTreeNodeModel;

		if (this._lastSelectedModel?.obj?.__instanceId === object.__instanceId) {
			model = this._lastSelectedModel;
		} else {
			model = this.model.getById(object.__instanceId);
		}

		if (!model?.obj) return;
		model.node.locked = object.__locked;
	}

	private onNodeSelected(node: ObjectTreeNode) {
		if (node?.model === this._lastSelectedModel) return;
		if (this._lastSelectedModel) this._lastSelectedModel.node.clearSelection();
		this._lastSelectedModel = node.model;
		Editor.data.selectObject(node.model.obj, DataOrigin.INSPECTOR);
	}

	private onNodeCollapseStateChanged(node: ObjectTreeNode, collapsed: boolean, all: boolean) {
		const m = node.model;
		this.changeCollapseState(m, collapsed, all);
	}

	private onFilterClear() {
		if (this._lastSelectedModel?.parent) {
			this.expandParents(this._lastSelectedModel.parent);
			this._lastSelectedModel.node.focus();
		}
	}
}

customElements.define(ObjectTreeInspector.tagName, ObjectTreeInspector);
