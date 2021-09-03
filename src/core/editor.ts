import { EditorData } from 'data/editor-data';
import { InspectorData } from 'data/inspector-data';
import { Actions } from './actions';
import { History } from './history';
import { Preferences } from './preferences';

class EditorClass {
	public data: EditorData
	public inspectorData: InspectorData;

	public actions: Actions;
	public history: History;
	public prefs: Preferences;

	public init() {
		this.data = new EditorData();
		this.inspectorData = new InspectorData();

		this.actions = new Actions();
		this.history = new History(this.data);
		this.prefs = new Preferences();
	}
}

export const Editor = new EditorClass();
