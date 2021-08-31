export enum DataOrigin {
	EDITOR = 0,
	INSPECTOR = 1,
};

class DataClass {
	private _selectedObject: PIXI.DisplayObject;

	public readonly onSelectedObjectChanged = new Phaser.Signal();

	public get selectedObject() { return this._selectedObject; }

	public selectObject(value: PIXI.DisplayObject) {
		this._selectedObject = value;
		this.onSelectedObjectChanged.dispatch(value);
	}

	private readonly onPropertyChanged: Record<DataOrigin, Phaser.Signal> = {
		[DataOrigin.EDITOR]: new Phaser.Signal(),
		[DataOrigin.INSPECTOR]: new Phaser.Signal(),
	};

	public addPropertyChangedListener(from: DataOrigin, listener: (property: string, value: any, obj?: PIXI.DisplayObject, from?: DataOrigin) => void, context?: any) {
		this.onPropertyChanged[from].add(listener, context);
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
			this.onPropertyChanged[e.from].dispatch(k, e.value, this._selectedObject, e.from);
		});
	}
}

export const Data = new DataClass();