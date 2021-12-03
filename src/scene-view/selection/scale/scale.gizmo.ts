export class OldScaleGizmo extends Phaser.Graphics {
	private readonly _cursor: string;

	constructor(game: Phaser.Game, public readonly factorH: number, public readonly factorV: number) {
		super(game);
		this.__skip = true;
		this
			.beginFill(0, 0)
			.drawCircle(0, 0, 18)
			.endFill()
			.lineStyle(2, 0xFFFFFF, 1)
			.beginFill(0xFF8C64, 1)
			.drawRect(-7, -7, 14, 14);

		this.inputEnabled = true;
		this.events.onInputOver.add(this.onInputOver, this);
		this.events.onInputOut.add(this.onInputOut, this);

		if (factorH === factorV) this._cursor = 'nwse-resize';
		else if (factorV === 0.5) this._cursor = 'ew-resize';
		else if (factorH === 0.5) this._cursor = 'ns-resize';
		else this._cursor = 'nesw-resize';
	}

	private onInputOver() { this.game.canvas.style.cursor = this._cursor; }
	private onInputOut() { this.game.canvas.style.cursor = 'auto'; }
}