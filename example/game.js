const game = new Phaser.Game({
	width: 1920,
	height: 1080,
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
}

function create() {
	game.plugins.add(new PhaserRuntimeEditor.Plugin(game, game.world));

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


	const child0 = el(20, 20, 1000, 900, game.world, 'child_0');
	
	const child00 = el(40, 40, 500, 500, child0, 'child_0-0');
	const child01 = el(300, 80, 500, 200, child0, 'child_0-1');
	const child02 = el(800, 500, 200, 200, child0, 'child_0-2');
	child02.pivot.set(100, 100);
	const child03 = el(700, 650, 200, 200, child0, 'child_0-3');
	child03.anchor.set(0.5, 0.5);

	const child000 = el(400, 400, 200, 200, child00, 'child_0-0-0');
	const child001 = el(20, 280, 200, 200, child00, 'child_0-0-1');
	const child010 = el(200, 20, 160, 160, child01, 'child_0-1-0');



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
		.beginFill(color, 0.1)
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
