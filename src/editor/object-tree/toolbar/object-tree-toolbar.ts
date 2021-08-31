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
		const item = document.createElement('div');
		item.classList.add(`level-${level}`);
		item.textContent = 'xxx';
		parent.appendChild(item);
		console.log(obj.children.length);
		if (!('children' in obj)) return;
		level = level + 1;
		for (let i = 0, n = obj.children.length; i < n; i++) {
			this.createItem(obj.children[i], item, level);
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