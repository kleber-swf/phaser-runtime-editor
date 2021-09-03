export interface Action {
	id: string;
	label?: string;
	icon?: string;
	shortcut?: string;
	toggle?: boolean;
	hold?: boolean;
	command: () => void;
	state?: () => any;
}

export class Actions {
	private readonly actions: Record<string, Action> = {};
	private readonly actionMap: Record<string, Action> = {};

	private _holdingToggleAction: Action;

	public getActions() { return Object.values(this.actions); }
	public getAction(id: string) { return id in this.actionMap ? this.actionMap[id] : null; }

	public setContainer(containerId: string) {
		const container = document.querySelector(containerId) as HTMLElement;
		container.tabIndex = 0;
		container.onkeydown = this.onKeyDown.bind(this);
		container.onkeyup = this.onKeyUp.bind(this);
	}

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
		const k = (e.ctrlKey ? 'ctrl+' : '')
			+ (e.shiftKey ? 'shift+' : '')
			+ e.key;
		if (k in this.actions) {
			const action = this.actions[k];
			action.command();
			if (action.toggle && action.hold)
				this._holdingToggleAction = action;
			e.preventDefault();
		}
	}

	private onKeyUp() {
		if (!this._holdingToggleAction) return;
		this._holdingToggleAction.command();
		this._holdingToggleAction = null;
	}
}
