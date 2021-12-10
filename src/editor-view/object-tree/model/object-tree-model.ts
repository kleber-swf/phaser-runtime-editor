import { Editor } from 'core/editor';
import { PhaserObjectType } from 'data/phaser-meta';
import { IdUtil } from 'util/id.util';
import { ObjectTreeNode } from '../tree-node/object-tree-node';

export interface ObjectTreeNodeModel {
	obj: PIXI.DisplayObject;
	type: PhaserObjectType;
	level: number;
	collapsed: boolean;
	isLeaf: boolean;
	node?: ObjectTreeNode;
	parent: ObjectTreeNodeModel;
}

export class ObjectTreeModel {
	private objectMap: Record<number, ObjectTreeNodeModel>;

	public getById(instanceId: number) { return this.objectMap[instanceId]; }

	public create(root: PIXI.DisplayObjectContainer | Phaser.Stage) {
		this.objectMap = {};
		this.createNode(root, this.objectMap, null, 0);
	}

	public empty() { this.objectMap = null; }

	// TODO __type and __isLeaf should be made elsewhere
	private createNode(child: PIXI.DisplayObject, map: Record<number, ObjectTreeNodeModel>, parent: ObjectTreeNodeModel, level: number) {
		if (!child.__instanceId) child.__instanceId = IdUtil.genIntId();
		const type = Editor.meta.getType(child);
		child.__type = type.name;
		child.__baseType = type.type;

		const isLeaf = type.ignoreChildren || !(child.children && child.children.length > 0);
		child.__isLeaf = isLeaf;

		const node = map[child.__instanceId] = {
			obj: child,
			collapsed: false,
			type,
			level,
			isLeaf,
			parent,
		};

		if (isLeaf) return;

		level += 1;
		for (let i = 0, n = child.children.length; i < n; i++) {
			this.createNode(child.children[i], map, node, level);
		}
	}

	public filter(filter: string) {
		const objects = this.objectMap;
		filter = filter ? filter.toLowerCase() : '';
		Object.keys(objects).forEach(k => {
			const o = objects[k] as ObjectTreeNodeModel;
			if (!o.node) return;
			o.node.classList.addOrRemove(
				'invisible',
				o.node.title.toLowerCase().indexOf(filter) < 0
			);
		});
	}
}
