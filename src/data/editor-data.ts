import { Preferences } from 'core/preferences/preferences';

export enum DataOrigin {
	ACTION = 0,
	SCENE = 1,
	INSPECTOR = 2,
}

export class EditorData {
	public root: Container;
	private saveLockedObjects = false;

	private _selectedObject: PIXI.DisplayObject;

	public get selectedObject() { return this._selectedObject; }

	public selectObject(value: PIXI.DisplayObject, from: DataOrigin) {
		if (value === this._selectedObject) return;
		this._selectedObject = value;
		(window as any).selection = value;
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

	public enable(root: Container, saveLockedObjects: boolean, prefs: Preferences) {
		this.root = root;
		this.saveLockedObjects = saveLockedObjects;

		if (!this.saveLockedObjects) return;

		const lockedObjects = prefs.get('lockedObjects') as string[];

		for (let i = lockedObjects.length - 1; i >= 0; i--) {
			let o: PIXI.DisplayObject = root;
			const path = lockedObjects[i].split(',').map(e => parseInt(e, 10));

			for (let p = 0; p < path.length; p++) {
				const index = path[p];
				if (index >= 0 && index < o.children.length) {
					o = o.children[index];
					continue;
				}
				o = null;
				break;
			}

			if (o) o.__locked = true;
			else lockedObjects.splice(i, 1);
		}

		prefs.set('lockedObjects', lockedObjects);
	}

	public toggleLockSelection(root: Container, prefs: Preferences) {
		if (!this._selectedObject) return;
		const obj = this._selectedObject;
		obj.__locked = !obj.__locked;
		this.onObjectLocked.dispatch(obj);

		if (!this.saveLockedObjects) return;

		const path: number[] = [];
		let o = obj;
		while (o.parent && o !== root) {
			path.unshift(o.parent.getChildIndex(o));
			o = o.parent;
		}

		const pathId = path.join(',');
		const locked = prefs.get('lockedObjects') as string[];
		const i = locked.indexOf(pathId);

		if (obj.__locked) {
			if (i < 0) locked.push(pathId);
		} else if (i >= 0) locked.splice(i, 1);

		prefs.set('lockedObjects', locked);
	}
}
