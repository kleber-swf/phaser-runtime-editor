/* eslint-disable no-undef */

const game = new Phaser.Game({
	width: 1920,
	height: 1080,
	renderer: Phaser.CANVAS,
	parent: 'game',
	scaleMode: Phaser.ScaleManager.USER_SCALE,
	state: { preload, create },
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
	game.load.image('phaser', 'assets/sprites/phaser1.png');
	game.load.image('particle', 'assets/particles/blue.png');
	game.load.bitmapFont('font', 'assets/fonts/nokia.png', 'assets/fonts/nokia.xml');
}

function create() {
	const plugin = game.plugins.add(new Phaser.Plugin.RuntimeEditor(game, {
		saveLockedObjectsPath: true,
		referenceImageUrl(width, height, _responsive) {
			return width > height
				? './refs/ref_landscape.jpg'
				: './refs/ref_portrait.jpg';
		},
	}));

	const grid = new Phaser.Graphics(game);

	grid.lineStyle(1, 0x777777, 0.1);
	for (let i = 0; i < game.width; i += 10) grid.moveTo(i, 0).lineTo(i, game.height);
	for (let i = 0; i < game.height; i += 10) grid.moveTo(0, i).lineTo(game.width, i);
	grid.lineStyle(1, 0x999999, 0.1);
	for (let i = 0; i < game.width; i += 100) grid.moveTo(i, 0).lineTo(i, game.height);
	for (let i = 0; i < game.height; i += 100) grid.moveTo(0, i).lineTo(game.width, i);

	grid.__locked = true;
	game.world.add(grid);

	const SIZE = 200;
	const DIST = 400;

	const parent = new Phaser.Group(game, game.world);
	parent.position.set(100, 300);

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

	child = el(960, -100, SIZE * 4, SIZE * 4, parent, 'deep-hierarchy');
	child = el(50, 50, SIZE * 3.5, SIZE * 3.5, child, 'child-1');
	child = el(50, 50, SIZE * 3, SIZE * 3, child, 'child-2');
	child = el(50, 50, SIZE * 2.5, SIZE * 2.5, child, 'child-3');
	child = el(50, 50, SIZE * 2, SIZE * 2, child, 'child-4');
	child = el(50, 50, SIZE * 1.5, SIZE * 1.5, child, 'child-5');
	child = el(50, 50, SIZE, SIZE, child, 'child-6');

	game.add.bitmapText(50, 50, 'font', 'This is a bitmap text', 30);

	const t = game.add.text(50, 150, 'This is a TTF text', {
		font: '36pt sans-serif',
		fontWeight: 'bold',
		fill: '#FF0',
		shadowBlur: 4,
		shadowColor: '#F00',
	});
	t.shadowFill = true;

	const sprite = game.add.sprite(960, 540, 'phaser');
	sprite.name = 'sprite';
	sprite.scale.set(2, 2);
	sprite.anchor.set(0.5, 0.5);
	sprite.inputEnabled = true;
	sprite.pivot.set(0, 20);
	sprite.events.onInputOver.add(() => sprite.alpha = 0.8);
	sprite.events.onInputOut.add(() => sprite.alpha = 1);
	sprite.events.onInputDown.add(() => console.log('INPUT DOWN ON SPRITE'));

	// const emitter = game.add.emitter(game.world.centerX, game.world.centerY + 500, 200);
	// emitter.makeParticles('particle');

	// emitter.setRotation(0, 0);
	// emitter.setAlpha(0.3, 0.8);
	// emitter.setScale(0.5, 1);
	// emitter.gravity = -200;
	// emitter.start(false, 5000, 100);

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
	// g.useHandCursor = true;
	return g;
}
