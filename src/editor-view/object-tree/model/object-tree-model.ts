import { Editor } from 'core/editor';
import { PhaserObjectType } from 'data/phaser-meta';
import { IdUtil } from 'util/id.util';
import { TreeNode } from '../tree-node/tree-node';

export interface ObjectMapItemModel {
	obj: PIXI.DisplayObject;
	type: PhaserObjectType;
	level: number;
	collapsed: boolean;
	isLeaf: boolean;
	node?: TreeNode;
	parent: ObjectMapItemModel;
}

export class ObjectTreeModel {
	private objectMap: Record<number, ObjectMapItemModel>;

	public getById(instanceId: number) { return this.objectMap[instanceId]; }

	public create(root: PIXI.DisplayObjectContainer | Phaser.Stage) {
		this.objectMap = {};
		this.createNode(root, this.objectMap, null, 0);
	}

	private createNode(child: PIXI.DisplayObject, map: Record<number, ObjectMapItemModel>, parent: ObjectMapItemModel, level: number) {
		if (!child.__instanceId) child.__instanceId = IdUtil.genIntId();
		const type = Editor.meta.getType(child);
		child.__type = type.name;

		const isLeaf = !(child.children && child.children.length > 0);
		const node = map[child.__instanceId] = {
			obj: child,
			collapsed: false,
			type, level,
			isLeaf, parent,
		};

		if (isLeaf) return;

		level += 1;
		for (let i = 0, n = child.children.length; i < n; i++)
			this.createNode(child.children[i], map, node, level);
	}

	public filter(filter: string) {
		const objects = this.objectMap;
		filter = filter ? filter.toLowerCase() : '';
		Object.keys(objects).forEach(k => {
			const o = objects[k] as ObjectMapItemModel;
			if (!o.node) return;
			if (o.node.title.toLowerCase().indexOf(filter) >= 0)
				o.node.classList.remove('invisible');
			else
				o.node.classList.add('invisible');
		});
	}
}