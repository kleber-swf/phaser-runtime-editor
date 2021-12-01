export interface PluginConfig {
	root: Container;
	refImage: Phaser.Image | Phaser.Sprite;
	pauseGame: boolean;
	clearPrefs: boolean;
}

export interface Point {
	x: number;
	y: number
}