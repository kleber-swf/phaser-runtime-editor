import { Actions } from 'data/actions';

class EditorClass {
	public actions: Actions;

	public init() {
		this.actions = new Actions();
	}
}

export const Editor = new EditorClass();