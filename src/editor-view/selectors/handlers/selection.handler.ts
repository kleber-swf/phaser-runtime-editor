import { Point } from 'plugin.model';
import { Selection } from '../selection';
import { SelectionUtil } from '../selection.util';


export class SelectionHandler {
	private readonly selection: Selection;
	private root: Container;

	constructor(selection: Selection) { this.selection = selection; }

	public enable(root: Container) { this.root = root; }

	public selectAt(e: MouseEvent) {
		const point = SelectionUtil.mouseEventToGamePoint(e, { x: 0, y: 0 });
		const obj = this.getObjectAt(point.x, point.y);
		this.selection.object = obj;
		return !!obj;
	}

	public isOverSelection(e: MouseEvent) {
		if (!this.selection.object) return false;
		const point = SelectionUtil.mouseEventToGamePoint(e, { x: 0, y: 0 });
		const result = this.selection.object.getBounds().contains(point.x, point.y);
		return result;
	}


	private getObjectAt(x: number, y: number) {
		const objects: PIXI.DisplayObject[] = [];
		this.getObjectsUnderPoint(x, y, this.root.children, objects);
		return this.setSelectionTree(objects);
	}

	private getObjectsUnderPoint(x: number, y: number, children: PIXI.DisplayObject[], objects: PIXI.DisplayObject[]) {
		for (let i = children.length - 1; i >= 0; i--) {
			const child = children[i];
			if (!child.visible || child.__skip || !('getBounds' in child)) continue;
			const bounds: PIXI.Rectangle = child.getBounds();
			if (!child.__isLeaf) this.getObjectsUnderPoint(x, y, child.children, objects);
			if (bounds.contains(x, y)) objects.push(child);
		}
	}


	/// ----

	private _lastSelectionTree: PIXI.DisplayObject[];
	private _lastSelectionTreeIndex = -1;

	private setSelectionTree(selectionTree: PIXI.DisplayObject[]) {
		if (!selectionTree) {
			this._lastSelectionTree = null;
			this._lastSelectionTreeIndex = - 1;
			return null;
		}

		const areEqual = this._lastSelectionTree?.length && this._lastSelectionTree.every((e, i) =>
			i < selectionTree.length && e === selectionTree[i]
		);

		// TODO test something like this
		// const areEqual = this._lastSelectionTree?.length && selectionTree.length
		// 	&& this._lastSelectionTree[0] === selectionTree[0];

		// or this
		// const index = this._lastSelectionTree?.length && selectionTree.length &&
		// 	this._lastSelectionTree.indexOf(selectionTree[0]);

		// to avoid situations like:
		// 1. click on an object (A) inside another (B) inside another (C)
		// 2. click on the same object (A) to select its parent (B)
		// 3. click on the parent (B)
		// 4. clicking on (B) should select (C) but it doesn't

		if (areEqual) {
			this._lastSelectionTreeIndex = (this._lastSelectionTreeIndex + 1) % this._lastSelectionTree.length;
		} else {
			this._lastSelectionTree = selectionTree;
			this._lastSelectionTreeIndex = 0;
		}

		return selectionTree[this._lastSelectionTreeIndex];
	}
}