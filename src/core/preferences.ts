import { Size } from 'plugin.model';
import { ActionHandler } from './action-handler';
import { Actions } from './actions';

export interface PreferencesData {
	snap: boolean;
	gizmos: boolean;
	guides: boolean;
	hitArea: boolean;
	allHitAreasSnapshot: boolean;	// do not save it

	// TODO join these properties
	leftPanelVisible: boolean;
	leftPanelSize: string;

	// TODO join these properties
	rightPanelVisible: boolean;
	rightPanelSize: string;

	// TODO join these properties
	responsive: boolean;
	responsiveSize: Size;
	responsiveSizeTemplateIndex: number;

	referenceImageVisible: boolean;

}

export type PreferenceKey = keyof PreferencesData;

const LS_KEY = '_pred_preferences_';

export class Preferences {
	public static readonly DefaultResponsiveSize: Readonly<Size> = { width: 450, height: 800 };
	private data: PreferencesData = {
		snap: true,
		gizmos: true,
		guides: false,
		referenceImageVisible: false,
		hitArea: false,
		allHitAreasSnapshot: false,
		responsive: false,
		responsiveSize: Preferences.DefaultResponsiveSize,
		responsiveSizeTemplateIndex: 0,

		leftPanelVisible: true,
		leftPanelSize: undefined,

		rightPanelVisible: true,
		rightPanelSize: undefined,
	};

	public readonly onPreferenceChanged = new Phaser.Signal();

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
		this.onPreferenceChanged.dispatch(key, value);
	}

	// hmm... this is weird
	public setupActions(actions: ActionHandler) {
		actions.setActionCommand(
			Actions.TOGGLE_SNAP,
			() => this.toggle('snap'),
			() => this.get('snap') as boolean
		);
		actions.setActionCommand(
			Actions.TOGGLE_GIZMOS,
			() => this.toggle('gizmos'),
			() => this.get('gizmos') as boolean
		);
		actions.setActionCommand(
			Actions.TOGGLE_GUIDES,
			() => this.toggle('guides'),
			() => this.get('guides') as boolean
		);
		actions.setActionCommand(
			Actions.TOGGLE_HIT_AREA,
			() => this.toggle('hitArea'),
			() => this.get('hitArea') as boolean
		);
		actions.setActionCommand(
			Actions.TOGGLE_RESPONSIVE,
			() => this.toggle('responsive'),
			() => this.get('responsive') as boolean
		);
		actions.setActionCommand(Actions.TOGGLE_ORIENTATION, () => {
			const size = this.get('responsiveSize') as Size;
			this.set('responsiveSize', { width: size.height, height: size.width });
		});
		actions.setActionCommand(
			Actions.TOGGLE_ALL_HIT_AREAS_SNAPSHOT,
			() => this.toggle('allHitAreasSnapshot', false),
			() => this.get('allHitAreasSnapshot') as boolean
		);
		actions.setActionCommand(
			Actions.TOGGLE_REF_IMAGE,
			() => this.toggle('referenceImageVisible'),
			() => this.get('referenceImageVisible') as boolean
		);

		actions.setActionCommand(
			Actions.TOGGLE_LEFT_PANEL,
			() => this.toggle('leftPanelVisible'),
			() => this.get('leftPanelVisible') as boolean
		);
		actions.setActionCommand(
			Actions.TOGGLE_RIGHT_PANEL,
			() => this.toggle('rightPanelVisible'),
			() => this.get('rightPanelVisible') as boolean
		);
	}
}
