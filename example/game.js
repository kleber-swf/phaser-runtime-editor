const game = new Phaser.Game({
	width: 1920,
	height: 1080,
	renderer: Phaser.AUTO,
	parent: 'game',
	scaleMode: Phaser.ScaleManager.SHOW_ALL,
	state: { preload, create, update },
	disableVisibilityChange: true
});

function preload() {
	game.stage.backgroundColor = '#000';
	game.load.image('mushroom', 'assets/sprites/mushroom2.png');
	game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
	game.load.image('phaser', 'assets/sprites/phaser1.png');
}

let cursors;
let logo1;
let logo2;

function create() {
	game.plugins.add(new PhaserRuntimeEditor.Plugin(game));

	// //  Modify the world and camera bounds
	// game.world.setBounds(-1000, -1000, 2000, 2000);

	// for (var i = 0; i < 200; i++) {
	// 	game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
	// }

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

	game.add.graphics(0, 0, game.stage)
		.lineStyle(4, 0xFFFFFF, 1)
		.beginFill(0, 0)
		.drawRect(0, 0, game.width, game.height);
}

function update() {
	// if (cursors.up.isDown) game.camera.y -= 4;
	// else if (cursors.down.isDown) game.camera.y += 4;

	// if (cursors.left.isDown) game.camera.x -= 4;
	// else if (cursors.right.isDown) game.camera.x += 4;
}
