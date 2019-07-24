export default function () {
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