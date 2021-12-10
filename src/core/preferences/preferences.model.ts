import { Size } from 'plugin.model';

export interface PreferencesData {
	snap: boolean;
	gizmos: boolean;
	guides: boolean;
	hitArea: boolean;
	hitAreasSnapshot: boolean;	// do not save it

	leftPanelVisible: boolean;
	leftPanelSize: string;

	rightPanelVisible: boolean;
	rightPanelSize: string;

	responsive: boolean;
	responsiveSize: Size;
	responsiveTemplateIndex: number;

	referenceImageVisible: boolean;

}

export type PreferenceKey = keyof PreferencesData;
