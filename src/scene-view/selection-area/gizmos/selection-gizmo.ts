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
		this.classList.addOrRemove('invisible', !value);
	}

	public set enabled(value: boolean) {
		this.classList.addOrRemove('disabled', !value);
	}

	public set showGuides(value: boolean) {
		this.guides.style.display = value ? 'block' : 'none';
	}

	public set showHitArea(value: boolean) {
		this._showHitArea = value;
		if (value) {
			this.setupHitArea(this._object);
			if (this._object) {
				this.drawHitArea(this._object.globalScale);
			}
		} else {
			this.setupHitArea(null);
		}
	}

	public get isOver() { return this._isOver; }

	public init() {
		Editor.data.onSelectedObjectChanged.add(this.onSelectionChanged, this);
		this.classList.add('selector', 'invisible');

		this.addEventListener('mouseover', this.onMouseOver.bind(this));
		this.addEventListener('mouseout', this.onMouseOut.bind(this));

		this.createGuides();
		this.createHitArea();

		const handlersParent = this.appendChild(document.createElement('div'));
		handlersParent.classList.add('handlers');
		this.createResizeHandlers(this.handlers, handlersParent);
	}

	private createResizeHandlers(handlers: HTMLElement[], parent: HTMLElement) {
		const vsides = [VSide.Top, VSide.Middle, VSide.Bottom];
		const hsides = [HSide.Left, HSide.Center, HSide.Right];

		vsides.forEach(v => {
			hsides.forEach(h => {
				if (v === VSide.Middle && h === HSide.Center) return;
				const el = parent.appendChild(document.createElement(ScaleGizmo.tagName)) as ScaleGizmo;
				el.init(v, h);
				handlers.push(el);
			});
		});

		this.pivot = parent.appendChild(document.createElement('div'));
		this.pivot.classList.add('pivot');

		this.anchor = parent.appendChild(document.createElement('div'));
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
		object.updateTransform();
		const scale = object.globalScale;
		const bounds = object.getBounds();

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

		if (this._objectHitArea) {
			this.drawHitArea(scale);
		}
	}

	private setupHitArea(object: PIXI.DisplayObject) {
		if (!object?.inputEnabled) {
			this.hitArea.style.display = 'none';
			this._objectHitArea = null;
			return;
		}

		this.hitArea.style.display = 'block';
		const b = object.getBounds();
		this._objectHitArea = object.hitArea as any ?? {
			x: 0,
			y: 0,
			width: Math.abs(b.width / object.scale.x),
			height: Math.abs(b.height / object.scale.y),
		};
		this.hitArea.style.borderRadius = this._objectHitArea.radius ? '50%' : '0';
	}

	private drawHitArea(scale: PIXI.Point) {
		const { _pointCache1, _pointCache2 } = this;
		const hitArea = this._objectHitArea;
		const style = this.hitArea.style;

		SelectionUtil.pointFromGameToArea(hitArea.x * scale.x, hitArea.y * scale.y, _pointCache1);

		if (hitArea.radius) {
			SelectionUtil.pointFromGameToArea(
				hitArea.radius * 2 * scale.x,
				hitArea.radius * 2 * scale.y,
				_pointCache2
			);
			_pointCache1.x -= _pointCache2.x * 0.5;
			_pointCache1.y -= _pointCache2.y * 0.5;
		} else {
			SelectionUtil.pointFromGameToArea(
				hitArea.width * scale.x,
				hitArea.height * scale.y,
				_pointCache2
			);
		}

		style.left = _pointCache1.x + 'px';
		style.top = _pointCache1.y + 'px';
		style.width = Math.abs(_pointCache2.x) + 'px';
		style.height = Math.abs(_pointCache2.y) + 'px';
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
