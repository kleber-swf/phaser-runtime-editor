import { Inspector } from 'editor/inspector/inspector';
import { TreeItem } from '../tree-item/tree-item';
import './object-tree-inspector.scss';

export class ObjectTreeInspector extends Inspector {
	public static readonly tagName: string = 'phed-object-tree-inspector';

	public connectedCallback() {
		super.connectedCallback();
		this.title = 'Objects';
	}

	public setContent(root: PIXI.DisplayObject | Phaser.Stage) {
		this.createItem(root, this.content, 0);
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

customElements.define(ObjectTreeInspector.tagName, ObjectTreeInspector);


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