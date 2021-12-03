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
		this.hside = hside = hside ?? 0;
		this.vside = vside = vside ?? 0;
		this.classList.add(VSide[vside].toLowerCase(), HSide[hside].toLowerCase());
		this.appendChild(document.createElement('div')).classList.add('handle');
	}
}

customElements.define(ScaleGizmo.tagName, ScaleGizmo);
