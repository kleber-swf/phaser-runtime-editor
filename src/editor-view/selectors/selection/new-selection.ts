import './selection.scss';

export class NewSelection extends HTMLElement {
	private _object: PIXI.DisplayObject;

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
	}
}

customElements.define('phred-selection', NewSelection);
