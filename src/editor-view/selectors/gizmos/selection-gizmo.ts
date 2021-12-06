import { Editor } from 'core/editor';
import { DataOrigin } from 'data/editor-data';
import { Point, Rect } from 'plugin.model';
import { SelectionUtil } from '../selection.util';
import { Gizmo, GIZMO_MOVE, HSide, VSide } from './gizmo';
import { ScaleGizmo } from './scale-gizmo';
import './selection-gizmo.scss';

export class SelectionGizmo extends HTMLElement implements Gizmo {
	public static readonly tagName = 'phred-selection-gizmo';
	public readonly type = GIZMO_MOVE;

	private _isOver = false;
	private _rect: Rect = { x: 0, y: 0, width: 0, height: 0 };
	private handlers: HTMLElement[] = [];
	private pivotGizmo: HTMLElement;
	private anchorGizmo: HTMLElement;
	private guidesGizmo: HTMLElement;

	private _pivot: Point = { x: 0, y: 0 };
	private _anchor: Point = { x: 0, y: 0 };

	public set visible(value: boolean) {
		this.style.display = value && Editor.data.selectedObject ? 'block' : 'none';
	}

	public set showGuides(value: boolean) {
		this.guidesGizmo.style.display = value ? 'block' : 'none';
	}

	public get isOver() { return this._isOver; }

	public init() {
		Editor.data.onSelectedObjectChanged.add(this.onSelectionChanged, this);
		this.classList.add('selector');

		this.addEventListener('mouseover', this.onMouseOver.bind(this));
		this.addEventListener('mouseout', this.onMouseOut.bind(this));

		this.createResizeHandlers(this.handlers);
		this.createGuides();
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
			});
		});

		this.pivotGizmo = this.appendChild(document.createElement('div'));
		this.pivotGizmo.classList.add('pivot');

		this.anchorGizmo = this.appendChild(document.createElement('div'));
		this.anchorGizmo.classList.add('anchor');
	}

	private createGuides() {
		const el = this.appendChild(document.createElement('div'));
		el.classList.add('guides');
		el.appendChild(document.createElement('div')).classList.add('horizontal');
		el.appendChild(document.createElement('div')).classList.add('vertical');
		this.guidesGizmo = el;
	}

	public redraw(object: PIXI.DisplayObject) {
		const bounds = object.getBounds();
		const scale = object.worldScale;

		const { style, _rect, _pivot, _anchor } = this;
		SelectionUtil.rectFromGameToArea(bounds, _rect);
		style.left = _rect.x + 'px';
		style.top = _rect.y + 'px';
		style.width = _rect.width + 'px';
		style.height = _rect.height + 'px';

		SelectionUtil.pointFromGameToArea(
			object.pivot.x * Math.abs(scale.x),
			object.pivot.y * Math.abs(scale.y),
			_pivot
		);
		this.pivotGizmo.style.transform = `translate(${_pivot.x}px, ${_pivot.y}px)`;

		if (object.anchor) {
			SelectionUtil.pointFromGameToArea(
				object.anchor.x * (object.width / object.scale.x),
				object.anchor.y * (object.height / object.scale.y),
				_anchor
			);
			this.anchorGizmo.style.top = _anchor.y + 'px';
			this.anchorGizmo.style.left = _anchor.x + 'px';
		}
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

	public onSelectionChanged(_origin: DataOrigin, object: PIXI.DisplayObject) {
		if (object) {
			this.visible = true;
			this.anchorGizmo.style.display = object.anchor ? 'block' : 'none';
		} else {
			this.visible = false;
		}
	}

	public onMouseOver() { this._isOver = true; }
	public onMouseOut() { this._isOver = false; }

	// #endregion
}

customElements.define(SelectionGizmo.tagName, SelectionGizmo);
