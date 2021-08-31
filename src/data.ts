export const EDITOR = 0;
export const INSPECTOR = 1;
type FROM = typeof EDITOR | typeof INSPECTOR;

class DataClass {
	private _selectedObject: PIXI.DisplayObject;

	public readonly onSelectedObjectChanged = new Phaser.Signal();

	public get selectedObject() { return this._selectedObject; }

	public selectObject(value: PIXI.DisplayObject) {
		this._selectedObject = value;
		this.onSelectedObjectChanged.dispatch(value);
	}

	private readonly onPropertyChanged: Record<FROM, Phaser.Signal> = {
		[EDITOR]: new Phaser.Signal(),
		[INSPECTOR]: new Phaser.Signal(),
	};

	public addPropertyChangedListener(from: FROM, listener: (property: string, value: any, obj?: PIXI.DisplayObject, from?: FROM) => void, context?: any) {
		this.onPropertyChanged[from].add(listener, context);
	}

	public propertyChanged(property: string, value: any, from: FROM) {
		if (this._selectedObject)
			this.onPropertyChanged[from].dispatch(property, value, this._selectedObject, from);
	}

}

export const Data = new DataClass();