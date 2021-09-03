import { EditorData } from 'data/editor-data';
import { Actions } from './actions';
import { History } from './history';
import { Preferences } from './preferences';

class EditorClass {
	public actions: Actions;
	public history: History;
	public prefs: Preferences;
	public data: EditorData

	public init() {
		this.data = new EditorData();
		this.actions = new Actions();
		this.history = new History(this.data);
		this.prefs = new Preferences();
	}
}

export const Editor = new EditorClass();
