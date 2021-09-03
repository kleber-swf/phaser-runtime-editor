export type PreferenceKey = keyof Preferences;

export class Preferences {
	private _snap = false;

	public get snap() { return this._snap; }

	public set snap(value: boolean) {
		this._snap = value;
		this.notifyListeners('snap', value);
	}

	private _gizmos = true;

	public get gizmos() { return this._gizmos; }

	public set gizmos(value: boolean) {
		this._gizmos = value;
		this.notifyListeners('gizmos', value);
	}

	public readonly onPreferenceChanged = new Phaser.Signal();

	private notifyListeners(field: PreferenceKey, value: any) {
		this.onPreferenceChanged.dispatch(field, value);
	}
}
