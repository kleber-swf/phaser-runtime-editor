export class EditorModel {
	private _lastSelectionTree: PIXI.DisplayObject[];
	private _lastSelectionTreeIndex = -1;

	public setSelectionTree(selectionTree: PIXI.DisplayObject[]) {
		if (!selectionTree) {
			// this.selection.setSelection(null);
			this._lastSelectionTree = null;
			this._lastSelectionTreeIndex = - 1;
			return null;
		}

		const areEqual = this._lastSelectionTree?.length && this._lastSelectionTree.every((e, i) =>
			i < selectionTree.length && e === selectionTree[i]
		);

		if (areEqual) {
			this._lastSelectionTreeIndex = (this._lastSelectionTreeIndex + 1) % this._lastSelectionTree.length;
		} else {
			this._lastSelectionTree = selectionTree;
			this._lastSelectionTreeIndex = 0;
		}

		return selectionTree[this._lastSelectionTreeIndex];
	}
}