import { IdUtil } from 'util/id.util';

export interface ObjectMapItem {
	target: PIXI.DisplayObject;
	level: number;
	node?: HTMLElement;
}

export class ObjectTreeModel {
	private objectMap: Record<number, ObjectMapItem>;

	public getById(instanceId: number) { return this.objectMap[instanceId]; }

	public create(root: PIXI.DisplayObjectContainer | Phaser.Stage) {
		this.objectMap = {};
		this.createNode(root, this.objectMap, 0);
	}

	private createNode(parent: PIXI.DisplayObject, map: Record<number, ObjectMapItem>, level: number) {
		parent.__instanceId = IdUtil.genIntId();
		map[parent.__instanceId] = { target: parent, level };
		if (!parent.children?.length) return;
		level += 1;
		for (let i = 0, n = parent.children.length; i < n; i++)
			this.createNode(parent.children[i], map, level);
	}
}