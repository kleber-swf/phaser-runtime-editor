/* eslint-disable no-undef */

const game = new Phaser.Game({
	width: 1920,
	height: 1920,
	renderer: Phaser.CANVAS,
	parent: 'game',
	scaleMode: Phaser.ScaleManager.USER_SCALE,
	state: { preload, create, update },
	backgroundColor: '#333',
});

const COLORS = [
	0xFEA443,
	0x705E78,
	0x812F33,
	0x3EB595,
	0x6446A6,
	0xBF1774,
	0x4D748C,
	0xF25757,
	0x8AA69B,
	0xD9A491,
];

let _colorIndex = 0;

// ======================================================== //

function preload() {
	game.load.image('mushroom', 'assets/sprites/mushroom2.png');
	game.load.image('phaser', 'assets/sprites/phaser1.png');
	game.load.image('ref', 'assets/sprites/ref.png');
	game.load.bitmapFont('font', 'assets/fonts/nokia.png', 'assets/fonts/nokia.xml');
}

function create() {
	const refImage = new Phaser.Image(game, 0, 0, 'ref');
	const plugin = game.plugins.add(new Phaser.Plugin.RuntimeEditor(game, { refImage: () => refImage }));

	const grid = new Phaser.Graphics(game);

	grid.lineStyle(1, 0x777777, 0.1);
	for (let i = 0; i < game.width; i += 10) grid.moveTo(i, 0).lineTo(i, game.height);
	for (let i = 0; i < game.height; i += 10) grid.moveTo(0, i).lineTo(game.width, i);
	grid.lineStyle(1, 0x999999, 0.1);
	for (let i = 0; i < game.width; i += 100) grid.moveTo(i, 0).lineTo(i, game.height);
	for (let i = 0; i < game.height; i += 100) grid.moveTo(0, i).lineTo(game.width, i);

	grid.__skip = true;
	game.world.add(grid);

	const SIZE = 200;
	const DIST = 400;

	const parent = new Phaser.Group(game, game.world);
	parent.position.set(100, 300);

	// parent.top = 0;
	// game.tweens.create(parent.scale)
	// 	.to({ x: 0.5, y: 0.5 }, 2000)
	// 	.to({ x: 1, y: 1 }, 2000)
	// 	.repeatAll(-1)
	// 	.start();

	// game.tweens.create(parent)
	// 	.to({ top: 0 }, 2000)
	// 	.to({ top: 0 }, 2000)
	// 	.repeatAll(-1)
	// 	.start();

	// 0   0
	let child = el(DIST * 0, DIST * 0, SIZE, SIZE, parent, 'child-a0-p0 child-a0-p0 child-a0-p0 child-a0-p0');
	child.scale.set(2, 2);

	// 0   .5
	child = el(DIST * 1, DIST * 0, SIZE, SIZE, parent, 'child-a0-p.5');
	child.pivot.set(0.5 * SIZE, 0.5 * SIZE);

	// 0   1
	child = el(DIST * 2, DIST * 0, SIZE, SIZE, parent, 'child-a0-p1');
	child.pivot.set(SIZE, SIZE);
	child.inputEnabled = true;
	child.input.useHandCursor = true;
	child.hitArea = new Phaser.Circle(0, 0, 200);

	// .5  0
	child = el(DIST * 0, DIST * 1, SIZE, SIZE, parent, 'child-a.5-p0');
	child.anchor.set(0.5, 0.5);

	// .5  .5
	child = el(DIST * 1, DIST * 1, SIZE, SIZE, parent, 'child-a.5-p.5');
	child.anchor.set(0.5, 0.5);
	child.pivot.set(0.5 * SIZE, 0.5 * SIZE);

	// .5  1
	child = el(DIST * 2, DIST * 1, SIZE, SIZE, parent, 'child-a.5-p1');
	child.anchor.set(0.5, 0.5);
	child.pivot.set(SIZE, SIZE);

	// 1   0
	child = el(DIST * 0, DIST * 2, SIZE, SIZE, parent, 'child-a1-p0');
	child.anchor.set(1, 1);

	// 1   .5
	child = el(DIST * 1, DIST * 2, SIZE, SIZE, parent, 'child-a1-p.5');
	child.anchor.set(1, 1);
	child.pivot.set(0.5 * SIZE, 0.5 * SIZE);

	// 1   1
	child = el(DIST * 2, DIST * 2, SIZE, SIZE, parent, 'child-a1-p1');
	child.anchor.set(1, 1);
	child.pivot.set(SIZE, SIZE);

	child = el(DIST * 3, 100, SIZE * 2, SIZE * 2, parent, 'child');
	child.pivot.set(SIZE * 1.5, SIZE * 1.5);
	child.inputEnabled = true;
	child.input.useHandCursor = true;
	child.hitArea = new Phaser.Rectangle(-100, -100, 200, 200);
	parent.setChildIndex(child, 0);

	child = el(DIST * 3, 500, SIZE, SIZE, parent, 'child-inverted');
	child.scale.set(-1, -1);

	child = game.add.sprite(900, 600, 'phaser');
	child.name = 'sprite';
	child.scale.set(2, 2);

	game.add.bitmapText(50, 50, 'font', 'This is a bitmap text', 30)
		.name = 'bitmap text';

	child = el(900, 700, SIZE * 4, SIZE * 4, parent, 'deep-hierarchy');
	child = el(50, 50, SIZE * 3.5, SIZE * 3.5, child, 'child-1');
	child = el(50, 50, SIZE * 3, SIZE * 3, child, 'child-2');
	child = el(50, 50, SIZE * 2.5, SIZE * 2.5, child, 'child-3');
	child = el(50, 50, SIZE * 2, SIZE * 2, child, 'child-4');
	child = el(50, 50, SIZE * 1.5, SIZE * 1.5, child, 'child-5');
	child = el(50, 50, SIZE, SIZE, child, 'child-6');

	plugin.show();
}

function el(x, y, w, h, parent, name) {
	_colorIndex = (_colorIndex + 1) % COLORS.length;
	const color = COLORS[_colorIndex];
	const g = game.add.graphics(x, y)
		.lineStyle(1, color, 1)
		.beginFill(color, 0.2)
		.drawRect(0, 0, w, h)
		.endFill();
	parent.addChild(g);
	g.name = name;

	const t = game.add.text(5, 5, name, {
		fill: '#' + color.toString(16),
		font: 'monospace',
		fontWeight: 'bold',
		fontSize: 14,
	});

	t.name = name + '_text';
	g.addChild(t);

	g.inputEnabled = true;
	g.useHandCursor = true;
	return g;
}

function update() {
	// 	if (cursors.up.isDown) game.camera.y -= 4;
	// 	else if (cursors.down.isDown) game.camera.y += 4;

	// 	if (cursors.left.isDown) game.camera.x -= 4;
	// 	else if (cursors.right.isDown) game.camera.x += 4;
}
