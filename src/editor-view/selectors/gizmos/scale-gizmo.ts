import { Gizmo, GIZMO_SCALE } from './gizmo';
import './scale-gizmo.scss';

export enum Corner {
	TopLeft,
	TopRight,
	BottomLeft,
	BottomRight,
}

export class ScaleGizmo extends HTMLElement implements Gizmo {
	public static readonly tagName = 'phred-scale-gizmo';
	public readonly type = GIZMO_SCALE;
	public corner: Corner;

	public init(corner: Corner) {
		this.corner = corner ?? 0;
		let clazz = '';
		switch (corner) {
			case Corner.TopRight: clazz = 'top-right'; break;
			case Corner.BottomLeft: clazz = 'bottom-left'; break;
			case Corner.BottomRight: clazz = 'bottom-right'; break;
			default: clazz = 'top-left';
		}
		this.classList.add(clazz);
		this.appendChild(document.createElement('div')).classList.add('handle');
	}
}

customElements.define(ScaleGizmo.tagName, ScaleGizmo);
