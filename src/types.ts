export type PanelSide = 'left' | 'right';

export type OnlyProperties<T> = {
	[K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
