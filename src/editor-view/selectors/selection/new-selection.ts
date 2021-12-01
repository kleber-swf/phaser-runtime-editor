import { Rect } from 'plugin.model';
import { SelectionUtil } from '../selection.util';
import './selection.scss';

export class NewSelection extends HTMLElement {
	private _object: PIXI.DisplayObject;
	private _rect: Rect = { x: 0, y: 0, width: 0, height: 0 };

	public init() {
		this.classList.add('selector');
	}

	public set object(obj: PIXI.DisplayObject) {
		if (!obj) {
			this._object = null;
			this.style.display = 'none';
			return;
		}
		console.log(obj.name);
		this.style.display = 'block';

		const bounds = obj.getBounds();
		this.redraw(bounds);
	}

	private redraw(bounds: PIXI.Rectangle) {
		SelectionUtil.rectFromGameToArea(bounds, this._rect);
		const { style, _rect } = this;
		style.left = `${_rect.x}px`;
		style.top = `${_rect.y}px`;
		style.width = `${_rect.width}px`;
		style.height = `${_rect.height}px`;
		console.log(bounds, this._rect);
	}
}

customElements.define('phred-selection', NewSelection);
