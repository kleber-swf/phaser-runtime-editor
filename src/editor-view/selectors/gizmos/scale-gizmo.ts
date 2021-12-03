import { Gizmo, GIZMO_SCALE } from './gizmo';
import './scale-gizmo.scss';

export class ScaleGizmo extends HTMLElement implements Gizmo {
	public static readonly tagName = 'phred-scale-gizmo';
	public readonly type = GIZMO_SCALE;

	public init(corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') {
		this.classList.add(corner);
		this.appendChild(document.createElement('div')).classList.add('handle');
	}
}

customElements.define(ScaleGizmo.tagName, ScaleGizmo);
