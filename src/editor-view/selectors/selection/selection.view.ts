import { Rect } from 'plugin.model';
import { SelectionChangedEvent, SelectionHandler } from '../handlers/selection.handler';
import { SelectionUtil } from '../selection.util';
import './selection.view.scss';

export class SelectionView extends HTMLElement {
	private _selection: SelectionHandler;
	private _rect: Rect = { x: 0, y: 0, width: 0, height: 0 };

	public init(selection: SelectionHandler) {
		this._selection = selection;
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

customElements.define('phred-selection', SelectionView);
