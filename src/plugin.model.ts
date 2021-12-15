export interface PluginConfigBuilder {
	pauseGame?: boolean;
	clearPreferences?: boolean;
	saveLockedObjectsPath?: boolean;
	root?: () => Container;
	referenceImageUrl?: (width: number, height: number, responsive: boolean) => string;
	onShow?: () => void;
	onHide?: () => void;
}

export interface PluginConfig {
	pauseGame: boolean;
	clearPreferences: boolean;
	saveLockedObjectsPath: boolean;
	root: Container;
	referenceImageUrl: (width: number, height: number, responsive: boolean) => string;
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

export type Side = 'left' | 'right';
