import { Size } from 'plugin.model';
import { ReferenceImageFilters } from 'scene-view/reference-image/reference-image';

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
	referenceImageFilters: ReferenceImageFilters;
}

export interface VolatileData {
	hitAreasSnapshot: boolean;
}

export type PersistentDataKey = keyof PersistentData;
export type VolatileDataKey = keyof VolatileData;
export type PreferenceKey = PersistentDataKey | VolatileDataKey;
