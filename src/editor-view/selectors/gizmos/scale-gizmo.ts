import { Gizmo, GIZMO_SCALE } from './gizmo';
import './scale-gizmo.scss';

export enum HSide {
	Left = 0,
	Center = 0.5,
	Right = 1,
}

export enum VSide {
	Top = 0,
	Middle = 0.5,
	Bottom = 1,
}

export class ScaleGizmo extends HTMLElement implements Gizmo {
	public static readonly tagName = 'phred-scale-gizmo';
	public readonly type = GIZMO_SCALE;
	public hside: HSide;
	public vside: VSide;

	public init(vside: VSide, hside: HSide) {
		this.hside = hside ?? 0;
		this.vside = vside ?? 0;
		let clazz = '';

		switch (vside) {
			case VSide.Top: clazz = 'top'; break;
			case VSide.Bottom: clazz += 'bottom'; break;
			default: clazz = 'middle'; break;
		}

		switch (hside) {
			case HSide.Right: clazz += '-right'; break;
			case HSide.Left: clazz += '-left'; break;
			default: clazz = '-center'; break;
		}

		this.classList.add(clazz);
		this.appendChild(document.createElement('div')).classList.add('handle');
	}
}

customElements.define(ScaleGizmo.tagName, ScaleGizmo);
