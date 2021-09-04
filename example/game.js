const game = new Phaser.Game({
	width: 1920,
	height: 2000,
	renderer: Phaser.AUTO,
	parent: 'game',
	scaleMode: Phaser.ScaleManager.SHOW_ALL,
	state: { preload, create, update },
	disableVisibilityChange: true,
	backgroundColor: '#333',
});

const COLORS = [
	0xFEA443, 0x705E78, 0x812F33, 0x3EB595, 0x6446A6,
	0xBF1774, 0x4D748C, 0xF25757, 0x8AA69B, 0xD9A491
];

let _colorIndex = 0;

// ======================================================== //

function preload() {
	game.load.image('mushroom', 'assets/sprites/mushroom2.png');
	game.load.image('phaser', 'assets/sprites/phaser1.png');
	game.load.image('ref', 'assets/sprites/ref.png');
}

function create() {
	const refImage = new Phaser.Image(game, 0, 0, 'ref');
	game.plugins.add(new PhaserRuntimeEditor.Plugin(game, game.world, refImage));

	//  Modify the world and camera bounds
	// game.world.setBounds(-1000, -1000, 2000, 2000);

	// for (var i = 0; i < 20; i++) {
	// 	const x = game.world.randomX;
	// 	const y = game.world.randomY;
	// 	const s = Math.random() + 1;
	// 	const sprite = game.add.sprite(x, y, 'mushroom');
	// 	sprite.name = `m_${x}x${y}`;
	// 	sprite.scale.set(s, s);
	// 	const text = game.add.text(0, 0, `${x}x${y}`, {
	// 		fill: '#ffffff',
	// 		fontSize: 16,
	// 		stroke: '#000',
	// 		strokeThickness: 2,
	// 	});
	// 	text.name = `t_${x}x${y}`;
	// 	sprite.addChild(text);
	// }


	// const child0 = el(20, 20, 1000, 900, game.world, 'child_0');

	// const child00 = el(40, 40, 500, 500, child0, 'child_0-0');
	// const child01 = el(300, 80, 500, 200, child0, 'child_0-1');
	// const child02 = el(800, 500, 200, 200, child0, 'child_0-2');
	// child02.pivot.set(100, 100);
	// const child03 = el(700, 650, 200, 200, child0, 'child_0-3');
	// child03.pivot.set(1, 1);
	// child03.anchor.set(0.5, 0.5);

	// const child000 = el(400, 400, 200, 200, child00, 'child_0-0-0');
	// const child001 = el(20, 280, 200, 200, child00, 'child_0-0-1');
	// const child010 = el(200, 20, 160, 160, child01, 'child_0-1-0');

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
	parent.position.set(100, 300)

	// 0   0
	let child = el(DIST * 0, DIST * 0, SIZE, SIZE, parent, 'child-a0-p0');

	// 0   .5
	child = el(DIST * 1, DIST * 0, SIZE, SIZE, parent, 'child-a0-p.5');
	child.pivot.set(0.5 * SIZE, 0.5 * SIZE);

	// 0   1
	child = el(DIST * 2, DIST * 0, SIZE, SIZE, parent, 'child-a0-p1');
	child.pivot.set(SIZE, SIZE);


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

	child = el(DIST * 3, 500, SIZE, SIZE, parent, 'child');
	child.scale.set(-1, -1);


	child = game.add.sprite(1180, 925, 'phaser');
	child.scale.set(2, 2);

	// game.add.text(0, 0, 'this text scrolls\nwith the background', { font: '32px Arial', fill: '#f26c4f', align: 'center' });

	// logo1 = game.add.sprite(0, 0, 'phaser');
	// logo1.fixedToCamera = true;
	// logo1.cameraOffset.setTo(100, 100);

	// logo2 = game.add.sprite(0, 0, 'phaser');
	// logo2.fixedToCamera = true;
	// logo2.cameraOffset.setTo(500, 100);

	// var t = game.add.text(0, 0, 'this text is fixed to the camera', { font: '32px Arial', fill: '#ffffff', align: 'center' });
	// t.fixedToCamera = true;
	// t.cameraOffset.setTo(200, 500);

	// game.add.tween(logo2.cameraOffset).to({ y: 400 }, 2000, Phaser.Easing.Back.InOut, true, 0, 2000, true);
	// cursors = game.input.keyboard.createCursorKeys();

	// game.add.graphics(0, 0, game.stage)
	// 	.lineStyle(4, 0xFFFFFF, 1)
	// 	.beginFill(0, 0)
	// 	.drawRect(0, 0, game.width, game.height);
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

	g.addChild(t);

	return g;
}

function update() {
	// 	if (cursors.up.isDown) game.camera.y -= 4;
	// 	else if (cursors.down.isDown) game.camera.y += 4;

	// 	if (cursors.left.isDown) game.camera.x -= 4;
	// 	else if (cursors.right.isDown) game.camera.x += 4;
}
