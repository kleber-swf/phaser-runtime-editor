import { Rect } from 'plugin.model';
import { Selection, SelectionChangedEvent } from '../selection';
import { SelectionUtil } from '../selection.util';
import './gizmo.scss';

// interface PropertiesCache {
// 	x: number;
// 	y: number;
// 	width: number;
// 	height: number;
// 	scaleX: number;
// 	scaleY: number;
// };

export class Gizmo extends HTMLElement {
	private _rect: Rect = { x: 0, y: 0, width: 0, height: 0 };
	private handlers: HTMLElement[] = [];

	// private _selectionPropertiesCache: PropertiesCache = {
	// 	x: 0, y: 0, width: 0, height: 0, scaleX: 0, scaleY: 0
	// }

	public init(selection: Selection) {
		selection.addEventListener('changed', this.onSelectionChanged.bind(this));
		this.classList.add('selector');

		this.createResizeHandlers(this.handlers);
	}

	private createResizeHandlers(handlers: HTMLElement[]) {
		const tl = this.appendChild(document.createElement('div'));
		tl.appendChild(document.createElement('div')).classList.add('handle');
		tl.classList.add('scale', 'top-left');
		handlers.push(tl);

		const tr = this.appendChild(document.createElement('div'));
		tr.appendChild(document.createElement('div')).classList.add('handle');
		tr.classList.add('scale', 'top-right');
		handlers.push(tr);

		const bl = this.appendChild(document.createElement('div'));
		bl.appendChild(document.createElement('div')).classList.add('handle');
		bl.classList.add('scale', 'bottom-left');
		handlers.push(bl);

		const br = this.appendChild(document.createElement('div'));
		br.appendChild(document.createElement('div')).classList.add('handle');
		br.classList.add('scale', 'bottom-right');
		handlers.push(br);
	}

	public redraw(object: PIXI.DisplayObject, checkCache = true) {
		// const cache = this._selectionPropertiesCache;
		const bounds = object.getBounds();
		// const scale = object.worldScale;
		// if (checkCache && cache.x === bounds.x && cache.y === bounds.y
		// 	&& cache.width === bounds.width && cache.height === cache.height
		// 	&& cache.scaleX === scale.x && cache.scaleY === scale.y) {
		// 	return;
		// }
		// cache.x = bounds.x;
		// cache.y = bounds.y;
		// cache.width = bounds.width;
		// cache.height = bounds.height;
		// cache.scaleX = scale.x;
		// cache.scaleY = scale.y;

		SelectionUtil.rectFromGameToArea(bounds, this._rect);
		const { style, _rect } = this;
		style.left = _rect.x + 'px';
		style.top = _rect.y + 'px';
		style.width = _rect.width + 'px';
		style.height = _rect.height + 'px';
	}

	public startMoving() {
		this.handlers.forEach(h => h.style.pointerEvents = 'none');
	}

	public stopMoving() {
		this.handlers.forEach(h => h.style.pointerEvents = 'all');
	}

	public onSelectionChanged(event: SelectionChangedEvent) {
		this.style.display = event.detail ? 'block' : 'none';
	}
}

customElements.define('phred-gizmo', Gizmo);
