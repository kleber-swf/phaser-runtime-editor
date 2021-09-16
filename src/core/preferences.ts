export type PreferenceKey = keyof Preferences;

export class Preferences {
	private _snap = true;

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

	private _guides = false;

	public get guides() { return this._guides; }

	public set guides(value: boolean) {
		this._guides = value;
		this.notifyListeners('guides', value);
	}

	private _referenceImage = false;

	public get referenceImage() { return this._referenceImage; }

	public set referenceImage(value: boolean) {
		this._referenceImage = value;
		this.notifyListeners('referenceImage', value);
	}

	public readonly onPreferenceChanged = new Phaser.Signal();

	private notifyListeners(field: PreferenceKey, value: any) {
		this.onPreferenceChanged.dispatch(field, value);
	}
}
