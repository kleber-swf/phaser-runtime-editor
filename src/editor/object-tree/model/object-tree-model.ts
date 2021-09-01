import { PhaserData, PhaserObjectType } from 'data/phaser-data';
import { IdUtil } from 'util/id.util';
import { TreeNode } from '../tree-node/tree-node';

export interface ObjectMapItemModel {
	target: PIXI.DisplayObject;
	type: PhaserObjectType;
	level: number;
	node?: TreeNode;
}

export class ObjectTreeModel {
	private objectMap: Record<number, ObjectMapItemModel>;

	public getById(instanceId: number) { return this.objectMap[instanceId]; }

	public create(root: PIXI.DisplayObjectContainer | Phaser.Stage) {
		this.objectMap = {};
		this.createNode(root, this.objectMap, 0);
	}

	private createNode(parent: PIXI.DisplayObject, map: Record<number, ObjectMapItemModel>, level: number) {
		const type = PhaserData.getType(parent.type);
		parent.__instanceId = IdUtil.genIntId();
		parent.__type = type.name;
		map[parent.__instanceId] = { target: parent, type, level };

		if (!parent.children?.length) return;

		level += 1;
		for (let i = 0, n = parent.children.length; i < n; i++)
			this.createNode(parent.children[i], map, level);
	}
}