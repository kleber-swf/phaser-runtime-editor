import { History } from './history';
import { Actions } from './actions';

class EditorClass {
	public actions: Actions;
	public history: History;

	public init() {
		this.actions = new Actions();
		this.history = new History();
	}
}

export const Editor = new EditorClass();