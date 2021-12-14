import { ActionHandler } from 'core/action-handler';
import { Actions } from 'core/actions';

export enum DataOrigin {
	ACTION = 0,
	SCENE = 1,
	INSPECTOR = 2,
}

export class EditorData {
	private _selectedObject: PIXI.DisplayObject;

	public get selectedObject() { return this._selectedObject; }

	public selectObject(value: PIXI.DisplayObject, from: DataOrigin) {
		if (value === this._selectedObject) return;
		this._selectedObject = value;
		this.onSelectedObjectChanged.dispatch(from, value);
	}

	public propertyChanged(property: string, value: any, from: DataOrigin) {
		if (!this._selectedObject) return;
		this._scheduledEvents[property] = { value, from };
		this._hasScheduledEvents = true;
	}

	/**
	 * @param {DataOrigin} from
	 * @param {PIXI.DisplayObject} obj
	 */
	public readonly onSelectedObjectChanged = new Phaser.Signal();

	/**
	 * @param {DataOrigin} from
	 * @param {string} property
	 * @param {any} value
	 * @param {PIXI.DisplayObject} obj
	 */
	public readonly onPropertyChanged = new Phaser.Signal();

	private _hasScheduledEvents = false;
	private _scheduledEvents: { [id: string]: { value: any, from: DataOrigin } } = {};

	public readonly onObjectLocked = new Phaser.Signal();

	public dispatchScheduledEvents() {
		if (!this._hasScheduledEvents) return;
		this._hasScheduledEvents = false;
		const events = this._scheduledEvents;
		this._scheduledEvents = {};
		Object.keys(events).forEach(k => {
			const e = events[k];
			this.onPropertyChanged.dispatch(e.from, k, e.value, this._selectedObject);
		});
	}

	public setupActions(actions: ActionHandler) {
		actions.setActionCommand(Actions.CLEAR_SELECTION, () => this.selectObject(null, DataOrigin.ACTION));
		actions.setActionCommand(Actions.PRINT_OBJECT, () => {
			if (this._selectedObject) console.info(this._selectedObject);
		});

		actions.setActionCommand(Actions.SELECT_PARENT, () => {
			if (this._selectedObject) this.selectObject(this._selectedObject.parent, DataOrigin.ACTION);
		});

		actions.setActionCommand(Actions.LOCK_SELECTION, () => {
			if (this._selectedObject) {
				this._selectedObject.__locked = !this._selectedObject.__locked;
				this.onObjectLocked.dispatch(this._selectedObject);
			}
		}, () => this._selectedObject?.__locked);
	}
}
