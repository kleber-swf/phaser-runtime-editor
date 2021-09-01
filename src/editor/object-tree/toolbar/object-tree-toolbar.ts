import { Data } from 'data/data';
import { TreeItem } from '../tree-item/tree-item';
import './object-tree-toolbar.scss';

export class ObjectTreeToolbar extends HTMLElement {
	public static readonly tagName: string = 'phed-object-tree-toolbar';

	public setContent(root: PIXI.DisplayObject | Phaser.Stage) {
		console.log(root);
		const content = document.createElement('div');
		content.classList.add('content');
		this.createItem(root, content, 0);
		this.appendChild(content);
	}

	private createItem(obj: PIXI.DisplayObject, parent: HTMLElement, level: number) {
		const item = document.createElement(TreeItem.tagName) as TreeItem;
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

customElements.define(ObjectTreeToolbar.tagName, ObjectTreeToolbar);


// export interface ObjectTreeItemModel{
// 	type: string;
// 	name: string;
// 	children?: ObjectTreeItemModel[];
// }

// export class ObjectTreeModel {
// 	private _items: ObjectTreeItemModel = {

// 	};

// 	public create(obj: PIXI.DisplayObject) {
// 		const items = this._items;
// 		items.length = 0;
// 		this.createItems(obj, items);
// 	}

// 	private createItems(obj: PIXI.DisplayObject, items: string[]) {
// 		items.add(obj.)
// 	}
// }