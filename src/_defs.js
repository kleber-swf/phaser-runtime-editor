export default function () {
	Object.defineProperties(PIXI.DisplayObject.prototype, {
		_$type: {
			value: '',
			writable: true,
			enumerable: false,
			configurable: false
		},
		_$uid: {
			value: 0,
			writable: true,
			enumerable: false,
			configurable: false
		}
	});

	Object.defineProperty(PIXI.DisplayObjectContainer.prototype, '_$children', {
		get() { return this.children; }
	});

	Object.defineProperty(Phaser.Text.prototype, '_$children', {
		get() { return []; }
	});

	Object.defineProperty(Phaser.BitmapText.prototype, '_$children', {
		get() { return []; }
	});
};