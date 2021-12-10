export interface PluginConfigBuilder {
	root?: () => Container;
	referenceImageUrl?: (width: number, height: number) => string;
	pauseGame?: boolean;
	clearPreferences?: boolean;
	onShow?: () => void;
	onHide?: () => void;
}

export interface PluginConfig {
	root: Container;
	referenceImageUrl: (width: number, height: number) => string;
	pauseGame: boolean;
	clearPreferences: boolean;
}

export interface Point {
	x: number;
	y: number;
}

export interface Size {
	width: number;
	height: number;
}

export interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export type PanelSide = 'left' | 'right';
