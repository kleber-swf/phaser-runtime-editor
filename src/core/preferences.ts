import { OnlyProperties, PanelSide } from 'types';
import { ActionHandler } from './action-handler';
import { Actions } from './actions';

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

	private _refImageVisible = false;

	public get refImageVisible() { return this._refImageVisible; }

	public set refImageVisible(value: boolean) {
		this._refImageVisible = value;
		this.notifyListeners('refImageVisible', value);
		this.save('refImageVisible', value);
	}

	private _refImageX = 0;

	public get refImageX() { return this._refImageX; }

	public set refImageX(value: number) {
		this._refImageX = value;
		this.notifyListeners('refImageX', value);
		this.save('refImageX', value);
	}

	private _refImageY = 0;

	public get refImageY() { return this._refImageY; }

	public set refImageY(value: number) {
		this._refImageY = value;
		this.notifyListeners('refImageY', value);
		this.save('refImageY', value);
	}

	private _hitArea = false;

	public get hitArea() { return this._hitArea; }

	public set hitArea(value: boolean) {
		this._hitArea = value;
		this.notifyListeners('hitArea', value);
		this.save('hitArea', value);
	}

	private _allHitAreasSnapshot = false;

	public get allHitAreasSnapshot() { return this._allHitAreasSnapshot; }

	public set allHitAreasSnapshot(value: boolean) {
		this._allHitAreasSnapshot = value;
		this.notifyListeners('allHitAreasSnapshot', value);
	}

	private _responsive = false;

	public get responsive() { return this._responsive; }

	public set responsive(value: boolean) {
		this._responsive = value;
		this.notifyListeners('responsive', value);
		this.save('responsive', value);
	}

	// #endregion

	public readonly onPreferenceChanged = new Phaser.Signal();

	public constructor(clean: boolean) {
		if (clean) localStorage.clear();
		this._snap = this.load('snap', true);
		this._gizmos = this.load('gizmos', true);
		this._guides = this.load('guides', false);
		this._hitArea = this.load('hitArea', false);
		this._responsive = this.load('responsive', false);
		this._refImageVisible = this.load('refImageVisible', false);
		this._refImageX = this.load('refImageX', 0);
		this._refImageY = this.load('refImageY', 0);
	}

	// hmm... this is weird
	public setupActions(actions: ActionHandler) {
		actions.setActionCommand(Actions.TOGGLE_SNAP, () => this.snap = !this._snap, () => this._snap);
		actions.setActionCommand(Actions.TOGGLE_GIZMOS, () => this.gizmos = !this._gizmos, () => this._gizmos);
		actions.setActionCommand(Actions.TOGGLE_GUIDES, () => this.guides = !this._guides, () => this._guides);
		actions.setActionCommand(Actions.TOGGLE_HIT_AREA, () => this.hitArea = !this._hitArea, () => this._hitArea);
		actions.setActionCommand(Actions.TOGGLE_RESPONSIVE, () => this.responsive = !this._responsive, () => this._responsive);
		actions.setActionCommand(
			Actions.TOGGLE_ALL_HIT_AREAS_SNAPSHOT,
			() => this.allHitAreasSnapshot = !this._allHitAreasSnapshot,
			() => this._allHitAreasSnapshot
		);
		actions.setActionCommand(
			Actions.TOGGLE_REF_IMAGE,
			() => this.refImageVisible = !this._refImageVisible,
			() => this._refImageVisible
		);
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
