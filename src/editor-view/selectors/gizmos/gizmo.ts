export const GIZMO_MOVE = 0;
export const GIZMO_SCALE = 1;

export interface Gizmo extends HTMLElement {
	get type(): number;
}