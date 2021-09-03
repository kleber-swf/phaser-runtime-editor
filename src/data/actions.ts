export interface Action {
	id: string;
	label?: string;
	icon?: string;
	shortcut?: string;
	toggle?: boolean;
	command: () => void;
	state?: () => any;
}

class ActionsClass {
	private readonly actions: Record<string, Action> = {};
	private readonly actionMap: Record<string, Action> = {};

	public getActions() { return Object.values(this.actions); }
	public getAction(id: string) { return id in this.actionMap ? this.actionMap[id] : null; }

	constructor() { document.onkeydown = this.onKeyDown.bind(this); }

	public add(...actions: Action[]) {
		actions.forEach(action => {
			if (action.shortcut) {
				if (action.shortcut in this.actions)
					throw new Error(`There is already an action with shortcut ${action.shortcut}: ${this.actions[action.shortcut].label}`);
				this.actions[action.shortcut] = action;
			}
			this.actionMap[action.id] = action;
		});
	}

	private onKeyDown(e: KeyboardEvent) {
		const k = (e.ctrlKey ? 'ctrl+' : '') + (e.shiftKey ? 'shift+' : '') + e.key;
		if (k in this.actions) {
			this.actions[k].command();
			e.preventDefault();
		}
	}
}

export const Actions = new ActionsClass();
