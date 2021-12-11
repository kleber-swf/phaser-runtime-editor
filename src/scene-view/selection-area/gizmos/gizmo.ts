export const GIZMO_MOVE = 0;
export const GIZMO_SCALE = 1;
export const GIZMO_ROTATION = 2;

export enum HSide {
	Right = 0,
	Center = 0.5,
	Left = 1,
}

export enum VSide {
	Bottom = 0,
	Middle = 0.5,
	Top = 1,
}

export interface Gizmo extends HTMLElement {
	get type(): number;
	readonly areaClasses: string[];
}
