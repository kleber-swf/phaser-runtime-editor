export enum DataOrigin {
	EDITOR = 0,
	INSPECTOR = 1,
};

export type PropertyChangedListener = (property: string, value: any, obj?: PIXI.DisplayObject, from?: DataOrigin) => void;

class DataClass {
	private _selectedObject: PIXI.DisplayObject;

	public readonly onSelectedObjectChanged = new Phaser.Signal();

	public get selectedObject() { return this._selectedObject; }

	public selectObject(value: PIXI.DisplayObject) {
		if (value === this._selectedObject) return;
		this._selectedObject = value;
		this.onSelectedObjectChanged.dispatch(value);
	}

	private readonly onPropertyChanged: Record<DataOrigin, PropertyChangedListener> = {
		[DataOrigin.EDITOR]: null,
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