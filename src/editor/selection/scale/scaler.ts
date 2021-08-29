export class Scaler {
	public readonly unscaledBounds = new Phaser.Rectangle();
	public readonly originalPivot = new PIXI.Point();
	public readonly transformPivot = new PIXI.Point();

	private obj: PIXI.DisplayObject;

	private _distFactorH: number;
	private _distFactorV: number;
	private _scaleH: boolean;
	private _scaleV: boolean;

	public startScaling(obj: PIXI.DisplayObject, factorH: number, factorV: number) {
		this.obj = obj;

		const dirH = Math.min(0, Math.sign(obj.scale.x));
		const dirV = Math.min(0, Math.sign(obj.scale.y));

		this._distFactorH = Math.sign(factorH - 1) || 1;
		this._distFactorV = Math.sign(factorV - 1) || 1;
		this._scaleH = factorH !== 0.5;
		this._scaleV = factorV !== 0.5;

		const bounds = obj.getBounds();
		this.unscaledBounds.setTo(
			bounds.x + bounds.width * factorH,
			bounds.y + bounds.height * factorV,
			bounds.width / obj.scale.x,
			bounds.height / obj.scale.y,
		);

		this.originalPivot.set(obj.pivot.x, obj.pivot.y);

		this.transformPivot.set(
			(factorH + dirH) * this.unscaledBounds.width,
			(factorV + dirV) * this.unscaledBounds.height,
		);

		obj.pivot.set(this.transformPivot.x, this.transformPivot.y);

		obj.position.set(
			obj.x + (this.transformPivot.x - this.originalPivot.x) * obj.scale.x,
			obj.y + (this.transformPivot.y - this.originalPivot.y) * obj.scale.y,
		);
	}

	public stopScaling() {
		const obj = this.obj;
		obj.pivot.set(this.originalPivot.x, this.originalPivot.y);
		obj.position.set(
			obj.x - (this.transformPivot.x - this.originalPivot.x) * obj.scale.x,
			obj.y - (this.transformPivot.y - this.originalPivot.y) * obj.scale.y,
		);
	}

	public scaleToPoint(x: number, y: number) {
		const ub = this.unscaledBounds;
		if (this._scaleH) this.obj.scale.x = ((ub.x - x) * this._distFactorH) / ub.width;
		if (this._scaleV) this.obj.scale.y = ((ub.y - y) * this._distFactorV) / ub.height;
	}
}