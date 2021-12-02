import { Rect } from 'plugin.model';
import { Selection, SelectionChangedEvent } from '../selection';
import { SelectionUtil } from '../selection.util';
import './gizmo.scss';

export class Gizmo extends HTMLElement {
	private _rect: Rect = { x: 0, y: 0, width: 0, height: 0 };

	public init(selection: Selection) {
		selection.addEventListener('changed', this.onSelectionChanged.bind(this));
		this.classList.add('selector');
	}

	private redraw(bounds: PIXI.Rectangle) {
		SelectionUtil.rectFromGameToArea(bounds, this._rect);
		const { style, _rect } = this;
		style.left = _rect.x + 'px';
		style.top = _rect.y + 'px';
		style.width = _rect.width + 'px';
		style.height = _rect.height + 'px';
	}

	public onSelectionChanged(event: SelectionChangedEvent) {
		if (!event.detail) {
			this.style.display = 'none';
			return;
		}
		this.style.display = 'block';
		this.redraw(event.detail.getBounds());
	}

}

customElements.define('phred-selection', Gizmo);
