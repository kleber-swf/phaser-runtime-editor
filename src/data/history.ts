export interface HistoryEntry {
	obj: PIXI.DisplayObject;
	properties: { [id: string]: any };
}

const HISTORY_LIMIT = 100;

class HistoryClass {
	private readonly entries: HistoryEntry[] = [];
	private holdingEntry: HistoryEntry;

	// TODO change this name please
	public readonly onHistoryWalk = new Phaser.Signal();

	public holdEntry(entry: HistoryEntry) { this.holdingEntry = entry; }
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
		Object.keys(entry.properties)
			.forEach(k => entry.obj[k] = entry.properties[k]);
		entry.obj.updateTransform();
		this.onHistoryWalk.dispatch(entry);
	}
}

export const History = new HistoryClass();
