import { Rect } from 'plugin.model';
import { Selection, SelectionChangedEvent } from '../selection';
import { SelectionUtil } from '../selection.util';
import { Gizmo, GIZMO_MOVE, HSide, VSide } from './gizmo';
import { RotationGizmo } from './rotation-gizmo';
import { ScaleGizmo } from './scale-gizmo';
import './selection-gizmo.scss';

// interface PropertiesCache {
// 	x: number;
// 	y: number;
// 	width: number;
// 	height: number;
// 	scaleX: number;
// 	scaleY: number;
// };

export class SelectionGizmo extends HTMLElement implements Gizmo {
	public static readonly tagName = 'phred-selection-gizmo';
	public readonly type = GIZMO_MOVE;

	private _isOver = false;
	private _rect: Rect = { x: 0, y: 0, width: 0, height: 0 };
	private handlers: HTMLElement[] = [];

	public get isOver() { return this._isOver; }

	// private _selectionPropertiesCache: PropertiesCache = {
	// 	x: 0, y: 0, width: 0, height: 0, scaleX: 0, scaleY: 0
	// }

	public init(selection: Selection) {
		selection.addEventListener('changed', this.onSelectionChanged.bind(this));
		this.classList.add('selector');

		this.addEventListener('mouseover', this.onMouseOver.bind(this));
		this.addEventListener('mouseout', this.onMouseOut.bind(this));

		this.createResizeHandlers(this.handlers);
	}

	private createResizeHandlers(handlers: HTMLElement[]) {
		const vsides = [VSide.Top, VSide.Middle, VSide.Bottom];
		const hsides = [HSide.Left, HSide.Center, HSide.Right];

		vsides.forEach(v => {
			hsides.forEach(h => {
				if (v === VSide.Middle && h === HSide.Center) return;
				const el = this.appendChild(document.createElement(ScaleGizmo.tagName)) as ScaleGizmo;
				el.init(v, h);
				handlers.push(el);
				if (v === VSide.Middle || h === HSide.Center) return;
				const r = this.appendChild(document.createElement(RotationGizmo.tagName)) as RotationGizmo;
				r.init(v, h);
				handlers.push(r);
			});
		});
	}

	public redraw(object: PIXI.DisplayObject) {
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
		this.style.pointerEvents = 'none';
		this.handlers.forEach(h => h.style.pointerEvents = 'none');
	}

	public stopMoving() {
		this.style.pointerEvents = 'all';
		this.handlers.forEach(h => h.style.pointerEvents = 'all');
	}

	// #region Event Listeners

	public onSelectionChanged(event: SelectionChangedEvent) {
		this.style.display = event.detail ? 'block' : 'none';
	}

	public onMouseOver() { this._isOver = true; }
	public onMouseOut() { this._isOver = false; }

	// #endregion
}

customElements.define(SelectionGizmo.tagName, SelectionGizmo);
