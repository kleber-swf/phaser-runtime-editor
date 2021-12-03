import { Rect } from 'plugin.model';
import { Selection, SelectionChangedEvent } from '../selection';
import { SelectionUtil } from '../selection.util';
import './gizmo.scss';

interface PropertiesCache {
	x: number;
	y: number;
	width: number;
	height: number;
};

export class Gizmo extends HTMLElement {
	private _rect: Rect = { x: 0, y: 0, width: 0, height: 0 };

	private _selectionPropertiesCache: PropertiesCache = {
		x: 0, y: 0, width: 0, height: 0,
	}

	public init(selection: Selection) {
		selection.addEventListener('changed', this.onSelectionChanged.bind(this));
		this.classList.add('selector');
	}

	public redraw(object: PIXI.DisplayObject) {
		const cache = this._selectionPropertiesCache;
		const bounds = object.getBounds();
		if (cache.x === bounds.x && cache.y === bounds.y
			&& cache.width === bounds.width && cache.height === cache.height) {
			return;
		}
		cache.x = bounds.x;
		cache.y = bounds.y;
		cache.width = bounds.width;
		cache.height = bounds.height;

		SelectionUtil.rectFromGameToArea(bounds, this._rect);
		const { style, _rect } = this;
		style.left = _rect.x + 'px';
		style.top = _rect.y + 'px';
		style.width = _rect.width + 'px';
		style.height = _rect.height + 'px';
	}

	public onSelectionChanged(event: SelectionChangedEvent) {
		this.style.display = event.detail ? 'block' : 'none';
	}
}

customElements.define('phred-selection', Gizmo);
