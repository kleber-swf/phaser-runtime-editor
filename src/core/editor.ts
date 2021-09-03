import { History } from './history';
import { Actions } from './actions';
import { Preferences } from './preferences';

class EditorClass {
	public actions: Actions;
	public history: History;
	public prefs: Preferences;

	public init() {
		this.actions = new Actions();
		this.history = new History();
		this.prefs = new Preferences();
	}
}

export const Editor = new EditorClass();