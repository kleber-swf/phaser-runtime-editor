import { DataOrigin, EditorData } from '../data/editor-data';
import { ActionHandler } from './action-handler';
import { Actions } from './actions';

export interface HistoryEntry {
	obj: PIXI.DisplayObject;
	properties: { [id: string]: any };
}

const HISTORY_LIMIT = 100;

export class History {
	private readonly entries: HistoryEntry[] = [];
	private holdingEntry: HistoryEntry;

	// TODO change this name please
	public readonly onHistoryWalk = new Phaser.Signal();

	constructor(private readonly data: EditorData) { }

	public setupActions(actions: ActionHandler) {
		actions.setActionCommand(Actions.UNDO, this.undo.bind(this));
	}

	public prepare(obj: PIXI.DisplayObject, properties: { [id: string]: any }) {
		const entry = this.holdingEntry = { obj, properties };
		Object.keys(entry.properties).forEach(k =>
			entry.properties[k] = JSON.stringify(entry.properties[k]));
		return this;
	}

	public cancel() { this.holdingEntry = null; }

	public commit() {
		if (!this.holdingEntry) return;
		if (this.entries.length === HISTORY_LIMIT)
			this.entries.shift();
		this.entries.push(this.holdingEntry);
		this.holdingEntry = null;
	}

	public undo() {
		if (this.entries.length === 0) return;
		const entry = this.entries.pop();
		this.apply(entry);
	}

	private apply(entry: HistoryEntry) {
		this.data.selectObject(entry.obj, DataOrigin.ACTION);

		const obj = entry.obj;
		// TODO make this recursive (if necessary)
		// TODO add support to arrays (if necessary)
		Object.keys(entry.properties)
			.forEach(pk => {
				const prop = JSON.parse(entry.properties[pk]);
				if (typeof prop === 'object') {
					Object.keys(prop).forEach(k => {
						obj[pk][k] = prop[k];
					});
				} else
					obj[pk] = prop;
				this.data.propertyChanged(pk, obj[pk], DataOrigin.ACTION);
			});

		obj.updateTransform();
		this.onHistoryWalk.dispatch(entry);
	}
}
