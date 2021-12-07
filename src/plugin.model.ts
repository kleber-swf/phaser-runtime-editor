export interface PluginConfigBuilder {
	root?: () => Container;
	refImage?: () => Phaser.Image | Phaser.Sprite;
	pauseGame?: boolean;
	clearPrefs?: boolean;
	onShow?: () => void;
	onHide?: () => void;
}

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

export interface Rect{
	x: number;
	y: number
	width: number;
	height: number;
}
