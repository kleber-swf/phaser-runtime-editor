import { OnlyProperties, PanelSide } from 'types';

export type PreferenceKey = OnlyProperties<Preferences>;

export class Preferences {
	// #region Preferences

	private _snap = true;

	public get snap() { return this._snap; }

	public set snap(value: boolean) {
		this._snap = value;
		this.notifyListeners('snap', value);
		this.save('snap', value);
	}

	private _gizmos = true;

	public get gizmos() { return this._gizmos; }

	public set gizmos(value: boolean) {
		this._gizmos = value;
		this.notifyListeners('gizmos', value);
		this.save('gizmos', value);
	}

	private _guides = false;

	public get guides() { return this._guides; }

	public set guides(value: boolean) {
		this._guides = value;
		this.notifyListeners('guides', value);
		this.save('guides', value);
	}

	private _referenceImage = false;

	public get referenceImage() { return this._referenceImage; }

	public set referenceImage(value: boolean) {
		this._referenceImage = value;
		this.notifyListeners('referenceImage', value);
		this.save('referenceImage', value);
	}

	// #endregion

	public readonly onPreferenceChanged = new Phaser.Signal();


	public constructor() {
		this._snap = this.load('snap', true);
		this._gizmos = this.load('gizmos', true);
		this._guides = this.load('guides', false);
		this._referenceImage = this.load('referenceImage', false);
	}


	public setPanelSize(side: PanelSide, width: string) { this.save(`panel.${side}`, width); }

	public getPanelSize(side: PanelSide): string {
		const result = this.load<string>(`panel.${side}`, '');
		return result === '' ? undefined : result;
	}


	private notifyListeners(field: PreferenceKey, value: any) {
		this.onPreferenceChanged.dispatch(field, value);
	}

	private load<T>(key: string, defaultValue: T): T {
		const v = localStorage.getItem(key);
		if (!v) return defaultValue;
		return typeof defaultValue === 'string' ? v : JSON.parse(v);
	}

	private save(key: string, value: { toString: () => string }) {
		localStorage.setItem(key, value.toString());
	}
}
