import { EditorData } from 'data/editor-data';
import { InspectorData } from 'data/inspector-data';
import { PhaserMeta } from 'data/phaser-meta';
import { ReferenceImage } from 'scene-view/reference-image';
import { ActionHandler } from './action-handler';
import { History } from './history';
import { Preferences } from './preferences';

class EditorClass {
	public data: EditorData
	public inspectorData: InspectorData;
	public meta: PhaserMeta;

	public actions: ActionHandler;
	public history: History;
	public prefs: Preferences;

	public referenceImage?: ReferenceImage;

	public init() {
		this.data = new EditorData();
		this.inspectorData = new InspectorData();
		this.meta = new PhaserMeta();

		this.actions = new ActionHandler();
		this.history = new History(this.data);
		this.prefs = new Preferences();
	}
}

export const Editor = new EditorClass();