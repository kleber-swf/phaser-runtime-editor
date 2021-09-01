export enum DataOrigin {
	SCENE = 1,
	INSPECTOR = 2,
};

export type PropertyChangedListener = (property: string, value: any, obj?: PIXI.DisplayObject, from?: DataOrigin) => void;

class DataClass {
	private _selectedObject: PIXI.DisplayObject;

	private readonly onSelectedObjectChanged: Record<DataOrigin, Phaser.Signal> = {
		[DataOrigin.SCENE]: new Phaser.Signal(),
		[DataOrigin.INSPECTOR]: new Phaser.Signal(),
	}

	public addObjectSelectionChangedListener(from: DataOrigin, listener: (obj: PIXI.DisplayObject) => void) {
		this.onSelectedObjectChanged[from].add(listener);
	}

	public get selectedObject() { return this._selectedObject; }

	public selectObject(value: PIXI.DisplayObject, from: DataOrigin) {
		if (value === this._selectedObject) return;
		this._selectedObject = value;
		this.onSelectedObjectChanged[from].dispatch(value, from);
	}

	private readonly onPropertyChanged: Record<DataOrigin, PropertyChangedListener> = {
		[DataOrigin.SCENE]: null,
		[DataOrigin.INSPECTOR]: null,
	};

	public setPropertyChangedListener(from: DataOrigin, listener: PropertyChangedListener) {
		this.onPropertyChanged[from] = listener;
	}

	public propertyChanged(property: string, value: any, from: DataOrigin) {
		if (!this._selectedObject) return;
		this._scheduledEvents[property] = { value, from };
		this._hasScheduledEvents = true;
	}

	private _hasScheduledEvents = false;
	private _scheduledEvents: { [id: string]: { value: any, from: DataOrigin } } = {};

	public dispatchScheduledEvents() {
		if (!this._hasScheduledEvents) return;
		this._hasScheduledEvents = false;
		const events = this._scheduledEvents;
		this._scheduledEvents = {};
		Object.keys(events).forEach(k => {
			const e = events[k];
			this.onPropertyChanged[e.from](k, e.value, this._selectedObject, e.from);
		});
	}
}

export const Data = new DataClass();