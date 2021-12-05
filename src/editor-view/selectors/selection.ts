export interface SelectionChangedEventInit extends CustomEventInit<PIXI.DisplayObject> {
}

export class SelectionChangedEvent extends CustomEvent<PIXI.DisplayObject> {
	constructor(type: 'changed', eventInitDict: SelectionChangedEventInit) {
		super(type, eventInitDict);
	}
}

export class Selection extends EventTarget {
	private _object: PIXI.DisplayObject;
	public top: number;
	public left: number;
	public bottom: number;
	public right: number;
	public pivotX: number;
	public pivotY: number;

	public get object(): PIXI.DisplayObject { return this._object; }

	public set object(value: PIXI.DisplayObject) {
		this._object = value;
		if (value) {
			this.top = value.top;
			this.left = value.left;
			this.bottom = value.bottom;
			this.right = value.right;
			this.pivotX = value.pivot.x;
			this.pivotY = value.pivot.y;
		}
		this.dispatchEvent(new SelectionChangedEvent('changed', { detail: value }));
	}
}
