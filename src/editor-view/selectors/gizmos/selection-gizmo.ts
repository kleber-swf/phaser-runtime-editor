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

	private handlers: HTMLElement[] = [];
	private pivot: HTMLElement;
	private anchor: HTMLElement;
	private guides: HTMLElement;
	private hitArea: HTMLElement;

	private _object: PIXI.DisplayObject;
	private _isOver = false;
	private _showHitArea: boolean;
	private _objectHitArea: { x: number, y: number, width: number, height: number, radius?: number };
	private _rectCache: Rect = { x: 0, y: 0, width: 0, height: 0 };
	private _pointCache1: Point = { x: 0, y: 0 };
	private _pointCache2: Point = { x: 0, y: 0 };

	public set visible(value: boolean) {
		this.style.display = value && Editor.data.selectedObject ? 'block' : 'none';
	}

	public set showGuides(value: boolean) {
		this.guides.style.display = value ? 'block' : 'none';
	}

	public set showHitArea(value: boolean) {
		this._showHitArea = value;
		if (value) {
			this.setupHitArea(this._object);
			if (this._object) this.drawHitArea(this._object.worldScale);
		} else {
			this.setupHitArea(null);
		}
	}

	public get isOver() { return this._isOver; }

	public init() {
		Editor.data.onSelectedObjectChanged.add(this.onSelectionChanged, this);
		this.classList.add('selector');

		this.addEventListener('mouseover', this.onMouseOver.bind(this));
		this.addEventListener('mouseout', this.onMouseOut.bind(this));

		this.createResizeHandlers(this.handlers);
		this.createGuides();
		this.createHitArea();
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

		this.pivot = this.appendChild(document.createElement('div'));
		this.pivot.classList.add('pivot');

		this.anchor = this.appendChild(document.createElement('div'));
		this.anchor.classList.add('anchor');
	}

	private createGuides() {
		const el = this.appendChild(document.createElement('div'));
		el.classList.add('guides');
		el.appendChild(document.createElement('div')).classList.add('horizontal');
		el.appendChild(document.createElement('div')).classList.add('vertical');
		this.guides = el;
	}

	private createHitArea() {
		this.hitArea = this.appendChild(document.createElement('div'));
		this.hitArea.classList.add('hit-area');
	}

	public redraw() {
		if (!this._object) return;
		const object = this._object;
		const bounds = this._object.getBounds();
		const scale = object.worldScale;

		const { style, _rectCache, _pointCache1 } = this;
		SelectionUtil.rectFromGameToArea(bounds, _rectCache);
		style.left = _rectCache.x + 'px';
		style.top = _rectCache.y + 'px';
		style.width = _rectCache.width + 'px';
		style.height = _rectCache.height + 'px';

		SelectionUtil.pointFromGameToArea(
			object.pivot.x * Math.abs(scale.x),
			object.pivot.y * Math.abs(scale.y),
			_pointCache1
		);
		this.pivot.style.transform = `translate(${_pointCache1.x}px, ${_pointCache1.y}px)`;

		if (object.anchor) {
			SelectionUtil.pointFromGameToArea(
				object.anchor.x * (object.width / object.scale.x),
				object.anchor.y * (object.height / object.scale.y),
				_pointCache1
			);
			this.anchor.style.top = _pointCache1.y + 'px';
			this.anchor.style.left = _pointCache1.x + 'px';
		}

		if (this._objectHitArea) this.drawHitArea(scale);
	}

	private setupHitArea(object: PIXI.DisplayObject) {
		if (!object?.inputEnabled) {
			this.hitArea.style.display = 'none';
			this._objectHitArea = null;
			return;
		}

		this.hitArea.style.display = 'block';
		this._objectHitArea = object.hitArea as any
			?? { x: 0, y: 0, width: object.width, height: object.height };
		this.hitArea.style.borderRadius = this._objectHitArea.radius ? '50%' : '0';
	}

	private drawHitArea(scale: PIXI.Point) {
		const { _pointCache1, _pointCache2 } = this;
		const hitArea = this._objectHitArea;
		SelectionUtil.pointFromGameToArea(hitArea.x * scale.x, hitArea.y * scale.y, _pointCache1);
		const haStyle = this.hitArea.style;
		if (hitArea.radius) {
			SelectionUtil.pointFromGameToArea(
				hitArea.radius * 2 * scale.x,
				hitArea.radius * 2 * scale.y,
				_pointCache2
			);
			haStyle.left = (_pointCache1.x - _pointCache2.x * 0.5) + 'px';
			haStyle.top = (_pointCache1.y - _pointCache2.y * 0.5) + 'px';
		} else {
			SelectionUtil.pointFromGameToArea(
				hitArea.width * scale.x,
				hitArea.height * scale.y,
				_pointCache2
			);
			haStyle.left = _pointCache1.x + 'px';
			haStyle.top = _pointCache1.y + 'px';
		}
		haStyle.width = _pointCache2.x + 'px';
		haStyle.height = _pointCache2.y + 'px';
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
		this._object = object;
		if (!object) {
			this.visible = false;
			this._objectHitArea = null;
			return;
		}

		this.anchor.style.display = object.anchor ? 'block' : 'none';
		this.setupHitArea(this._showHitArea ? object : null);
		this.visible = true;
	}

	public onMouseOver() { this._isOver = true; }
	public onMouseOut() { this._isOver = false; }

	// #endregion
}

customElements.define(SelectionGizmo.tagName, SelectionGizmo);
