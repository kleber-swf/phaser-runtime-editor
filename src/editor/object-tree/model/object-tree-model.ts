import { PhaserData, PhaserObjectType } from 'data/phaser-data';
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
		const type = PhaserData.getType(child.type);
		child.__instanceId = IdUtil.genIntId();
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
}