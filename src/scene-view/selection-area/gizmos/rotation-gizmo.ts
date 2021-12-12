import { Gizmo, GIZMO_ROTATION, HSide, VSide } from './gizmo';
import './rotation-gizmo.scss';

export class RotationGizmo extends HTMLElement implements Gizmo {
	public static readonly tagName = 'phred-rotation-gizmo';
	public readonly type = GIZMO_ROTATION;
	public readonly areaClasses: string[] = [];

	public init(vside: VSide, hside: HSide) {
		this.classList.add(HSide[hside].toLowerCase(), VSide[vside].toLowerCase());
	}
}

customElements.define(RotationGizmo.tagName, RotationGizmo);
