import { Size } from 'plugin.model';
import { PersistentData, PreferenceKey, VolatileData } from './preferences.model';

const LS_KEY = '_phred_preferences_';

export class Preferences {
	public static readonly DefaultResponsiveSize: Readonly<Size> = { width: 450, height: 800 };

	private persistentData: PersistentData = {
		snap: true,
		gizmos: true,
		guides: false,
		hitArea: false,
		responsive: false,
		responsiveSize: Preferences.DefaultResponsiveSize,
		responsiveTemplateIndex: 0,

		leftPanelVisible: true,
		leftPanelSize: undefined,

		rightPanelVisible: true,
		rightPanelSize: undefined,

		referenceImageVisible: false,
		referenceImageFilters: {
			opacity: 0.4,
			hue: 0,
			saturation: 1,
			contrast: 1,
			brightness: 1,
			sepia: 0,
		},
	};

	private volatileData: VolatileData = {
		hitAreasSnapshot: false,
	};

	public readonly onChange = new Phaser.Signal();

	public constructor(clean: boolean) {
		if (clean) localStorage.clear();
		try {
			const data = this.load();
			this.persistentData = Object.assign(this.persistentData, data);
		} catch (_e: any) {
			localStorage.clear();
		}
	}

	public get(key: PreferenceKey) {
		return this.persistentData[key] ?? this.volatileData[key];
	}

	public set(key: PreferenceKey, value: any, save = true) {
		if (key in this.persistentData) {
			this.persistentData[key] = value;
			if (save) this.save();
		} else {
			this.volatileData[key] = value;
		}
		this.notifyListeners(key, value);
	}

	public toggle(key: PreferenceKey, save = true) {
		this.set(key, !this.persistentData[key], save);
	}

	private load() {
		const content = localStorage.getItem(LS_KEY);
		return content ? JSON.parse(content) : {};
	}

	private save() {
		const content = JSON.stringify(this.persistentData);
		localStorage.setItem(LS_KEY, content);
	}

	private notifyListeners(key: PreferenceKey, value: any) {
		this.onChange.dispatch(key, value);
	}
}
