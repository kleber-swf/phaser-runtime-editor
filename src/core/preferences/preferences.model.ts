import { Size } from 'plugin.model';

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
