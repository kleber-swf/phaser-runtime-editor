interface Action {
	label: string;
	command: () => void;
	shortcut: string;
}

class ActionsClass {
	private readonly actionMap: Record<string, Action> = {};

	constructor() {
		document.onkeydown = this.onKeyDown.bind(this);
	}

	public add(...actions: Action[]) {
		actions.forEach(action => {
			if (action.shortcut in this.actionMap)
				throw new Error(`There is already an action with shortcut ${action.shortcut}: ${this.actionMap[action.shortcut].label}`);
			this.actionMap[action.shortcut] = action;
		});
	}

	private onKeyDown(e: KeyboardEvent) {
		const k = (e.ctrlKey ? 'ctrl+' : '') + e.key;
		if (k in this.actionMap) this.actionMap[k].command();
	}
}

export const Actions = new ActionsClass();
