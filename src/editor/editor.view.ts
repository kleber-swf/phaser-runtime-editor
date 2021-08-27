export class EditorView extends Phaser.Group {
	private readonly touchArea: Phaser.Graphics;
	private readonly drawingArea: Phaser.Graphics;
	private readonly container: Phaser.Group | Phaser.Stage;

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
		this.drawingArea = new Phaser.Graphics(game, 0, 0);
		this.addChild(this.drawingArea);
		this.redrawTouchArea();
	}

	private createTouchArea(game: Phaser.Game) {
		const graphics = new Phaser.Graphics(game);
		graphics.inputEnabled = true;
		graphics.events.onInputUp.add(this.onTouch, this);
		// game.scale.onSizeChange.add(this.redrawTouchArea, this);
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
		const p = this.game.input.mousePointer;
		console.log(p.worldX, p.worldY);
		const result: PIXI.DisplayObject[] = [];
		this.getObjectsUnderPoint(pointer.x, pointer.y, this.container.children, result);
		console.log(result.map(e => e.name));

		if (result.length > 0)
			this._selection = result[0];
		else
			this._selection = null;
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

	private _selection: PIXI.DisplayObject;

	public update() {
		this.drawingArea.clear();
		if (!this._selection) return;
		const bounds = this._selection.getBounds();
		this.drawingArea
			.lineStyle(2, 0x00FF00, 1)
			.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
	}
}