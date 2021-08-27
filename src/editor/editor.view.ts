import { Selection } from './selection';

export class EditorView extends Phaser.Group {
	private readonly touchArea: Phaser.Graphics;
	private readonly container: Phaser.Group | Phaser.Stage;
	private readonly selection: Selection;

	constructor(game: Phaser.Game, container: Phaser.Group | Phaser.Stage, parent: Phaser.Group | Phaser.Stage) {
		super(game, parent);

		this.__skip = true;
		game.stage.__skip = true;
		game.world.__skip = true;

		// const scale = game.scale.scaleFactor;
		// this.scale.copyFrom(scale);
		// game.scale.onSizeChange.add(() => this.scale.copyFrom(game.scale.scaleFactor));
		this.container = container;

		this.touchArea = this.createTouchArea(game);
		this.redrawTouchArea();

		this.selection = new Selection(game);
		this.addChild(this.selection);
	}

	private createTouchArea(game: Phaser.Game) {
		const graphics = new Phaser.Graphics(game);
		graphics.inputEnabled = true;
		graphics.events.onInputDown.add(this.onTouch, this);
		// TODO game.scale.onSizeChange.add(this.redrawTouchArea, this);
		this.add(graphics);
		return graphics;
	}

	private redrawTouchArea() {
		const sm = this.game;
		this.touchArea.clear()
			.beginFill(0, 0)
			.drawRect(0, 0, sm.width, sm.height)
			.endFill();
	}

	private onTouch(_: any, pointer: Phaser.Pointer) {
		const result: PIXI.DisplayObject[] = [];
		this.getObjectsUnderPoint(pointer.x, pointer.y, this.container.children, result);
		this.setSelection(result);
	}

	private getObjectsUnderPoint(x: number, y: number, children: PIXI.DisplayObject[], result: PIXI.DisplayObject[]) {
		for (let i = children.length - 1; i >= 0; i--) {
			const child = children[i];
			if (child.__skip || !('getBounds' in child)) continue;
			const bounds: PIXI.Rectangle = child.getBounds();
			if ('children' in child) this.getObjectsUnderPoint(x, y, child.children, result);
			if (bounds.contains(x, y)) result.push(child);
		}
	}

	private _lastSelectionTree: PIXI.DisplayObject[];
	private _lastSelectionTreeIndex = -1;

	private setSelection(selectionTree: PIXI.DisplayObject[]) {
		if (!selectionTree) {
			this.selection.setSelection(null);
			this._lastSelectionTree = null;
			this._lastSelectionTreeIndex = - 1;
			return;
		}

		const areEqual = this._lastSelectionTree && this._lastSelectionTree.every((e, i) =>
			i < selectionTree.length && e === selectionTree[i]
		);

		if (areEqual) {
			this._lastSelectionTreeIndex = (this._lastSelectionTreeIndex + 1) % this._lastSelectionTree.length;
		} else {
			this._lastSelectionTree = selectionTree;
			this._lastSelectionTreeIndex = 0;
		}

		this.selection.setSelection(selectionTree[this._lastSelectionTreeIndex]);
	}
}