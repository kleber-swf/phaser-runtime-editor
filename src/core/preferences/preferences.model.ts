import { Size } from 'plugin.model';

export interface PersistentData {
	snap: boolean;
	gizmos: boolean;
	guides: boolean;
	hitArea: boolean;

	leftPanelVisible: boolean;
	leftPanelSize: string;

	rightPanelVisible: boolean;
	rightPanelSize: string;

	responsive: boolean;
	responsiveSize: Size;
	responsiveTemplateIndex: number;

	referenceImageVisible: boolean;
}

export interface VolatileData {
	hitAreasSnapshot: boolean;
}

export type PersistentDataKey = keyof PersistentData;
export type VolatileDataKey = keyof VolatileData;
export type PreferenceKey = PersistentDataKey | VolatileDataKey;
