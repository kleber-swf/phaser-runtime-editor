import { Size } from 'plugin.model';
import { PreferenceKey, PreferencesData } from './preferences.model';

const LS_KEY = '_phred_preferences_';

export class Preferences {
	public static readonly DefaultResponsiveSize: Readonly<Size> = { width: 450, height: 800 };

	private data: PreferencesData = {
		snap: true,
		gizmos: true,
		guides: false,
		hitArea: false,
		hitAreasSnapshot: false,
		responsive: false,
		responsiveSize: Preferences.DefaultResponsiveSize,
		responsiveTemplateIndex: 0,

		leftPanelVisible: true,
		leftPanelSize: undefined,

		rightPanelVisible: true,
		rightPanelSize: undefined,

		referenceImageVisible: false,
	};

	public readonly onChange = new Phaser.Signal();

	public constructor(clean: boolean) {
		if (clean) localStorage.clear();
		try {
			const data = this.load();
			this.data = Object.assign(this.data, data);
		} catch (_e: any) {
			localStorage.clear();
		}
	}

	public get(key: keyof PreferencesData) {
		return this.data[key];
	}

	public set(key: PreferenceKey, value: any, save = true) {
		this.data[key as string] = value;
		if (save) this.save();
		this.notifyListeners(key, value);
	}

	public toggle(key: PreferenceKey, save = true) {
		this.set(key, !this.data[key], save);
	}

	private load() {
		const content = localStorage.getItem(LS_KEY);
		console.log('loading', JSON.parse(content));
		return content ? JSON.parse(content) : {};
	}

	private save() {
		const content = JSON.stringify(this.data);
		console.log('saving', this.data);
		localStorage.setItem(LS_KEY, content);
	}

	private notifyListeners(key: PreferenceKey, value: any) {
		this.onChange.dispatch(key, value);
	}
}
