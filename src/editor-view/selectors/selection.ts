export class SelectionChangedEvent extends CustomEvent<PIXI.DisplayObject> {
}

export class Selection extends EventTarget {
	private _object: PIXI.DisplayObject;

	public get object(): PIXI.DisplayObject { return this._object; }

	public set object(value: PIXI.DisplayObject) {
		this._object = value;
		this.dispatchEvent(new SelectionChangedEvent('changed', {
			detail: value
		}));
	}
}