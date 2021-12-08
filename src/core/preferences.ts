import { Size } from 'plugin.model';
import { OnlyProperties, PanelSide } from 'types';
import { ActionHandler } from './action-handler';
import { Actions } from './actions';

export type PreferenceKey = OnlyProperties<Preferences>;

const DEFAULT_RESPONSIVE_SIZE: Readonly<Size> = { width: 450, height: 800 };

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

	private _responsiveSize: Size = Object.assign({}, DEFAULT_RESPONSIVE_SIZE);

	public get responsiveSize() { return this._responsiveSize; }

	public set responsiveSize(value: Size) {
		value = value ?? Object.assign({}, DEFAULT_RESPONSIVE_SIZE);
		value.width = value.width > 0 ? value.width : DEFAULT_RESPONSIVE_SIZE.width;
		value.height = value.height > 0 ? value.height : DEFAULT_RESPONSIVE_SIZE.height;
		this._responsiveSize = value;
		this.notifyListeners('responsiveSize', value);
		this.save('responsiveSize', value);
	}

	private _responsiveSizeTemplateIndex: number;

	public get responsiveSizeTemplateIndex() { return this._responsiveSizeTemplateIndex; }

	public setResponsiveSizeTemplate(index: number, width: number, height: number) {
		this._responsiveSizeTemplateIndex = index;
		this.notifyListeners('responsiveSizeTemplateIndex', index);

		const currentSize = this._responsiveSize;

		width = width ?? currentSize.width ?? DEFAULT_RESPONSIVE_SIZE.width;
		height = height ?? currentSize.height ?? DEFAULT_RESPONSIVE_SIZE.height;

		if (currentSize.height > currentSize.width) {
			const aux = width;
			width = height;
			height = aux;
		}

		this.responsiveSize = { width, height };
		this.save('responsiveSizeTemplateIndex', index);
	}

	private _leftPanelVisible = true;

	public get leftPanelVisible(): boolean { return this._leftPanelVisible; }

	public set leftPanelVisible(value: boolean) {
		this._leftPanelVisible = value;
		this.notifyListeners('leftPanelVisible', value);
		this.save('leftPanelVisible', value);
	}

	private _rightPanelVisible = true;

	public get rightPanelVisible(): boolean { return this._rightPanelVisible; }

	public set rightPanelVisible(value: boolean) {
		this._rightPanelVisible = value;
		this.notifyListeners('rightPanelVisible', value);
		this.save('rightPanelVisible', value);
	}

	// #endregion

	public readonly onPreferenceChanged = new Phaser.Signal();

	public constructor(clean: boolean) {
		if (clean) localStorage.clear();
		try {
			this._snap = this.load('snap', true);
			this._gizmos = this.load('gizmos', true);
			this._guides = this.load('guides', false);
			this._hitArea = this.load('hitArea', false);
			this._responsive = this.load('responsive', false);
			this._refImageVisible = this.load('refImageVisible', false);
			this._refImageX = this.load('refImageX', 0);
			this._refImageY = this.load('refImageY', 0);
			this._responsiveSize = this.load('responsiveSize', Object.assign({}, DEFAULT_RESPONSIVE_SIZE));
			this._responsiveSizeTemplateIndex = this.load('responsiveSizeTemplateIndex', 0);
			this._leftPanelVisible = this.load('leftPanelVisible', true);
			this._rightPanelVisible = this.load('rightPanelVisible', true);
		} catch (_e: any) {
			localStorage.clear();
		}
	}

	// hmm... this is weird
	public setupActions(actions: ActionHandler) {
		actions.setActionCommand(Actions.TOGGLE_SNAP, () => this.snap = !this._snap, () => this._snap);
		actions.setActionCommand(Actions.TOGGLE_GIZMOS, () => this.gizmos = !this._gizmos, () => this._gizmos);
		actions.setActionCommand(Actions.TOGGLE_GUIDES, () => this.guides = !this._guides, () => this._guides);
		actions.setActionCommand(Actions.TOGGLE_HIT_AREA, () => this.hitArea = !this._hitArea, () => this._hitArea);
		actions.setActionCommand(Actions.TOGGLE_RESPONSIVE, () => this.responsive = !this._responsive, () => this._responsive);
		actions.setActionCommand(Actions.TOGGLE_ORIENTATION, () => {
			const size = this._responsiveSize;
			this.responsiveSize = { width: size.height, height: size.width };
		});
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

		actions.setActionCommand(
			Actions.TOGGLE_LEFT_PANEL,
			() => this.leftPanelVisible = !this._leftPanelVisible,
			() => this._leftPanelVisible
		);
		actions.setActionCommand(
			Actions.TOGGLE_RIGHT_PANEL,
			() => this.rightPanelVisible = !this._rightPanelVisible,
			() => this._rightPanelVisible
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

	private save(key: string, value: any) {
		localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value.toString());
	}
}
