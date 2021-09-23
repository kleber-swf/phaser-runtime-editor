export interface Action {
	id: string;
	label?: string;
	icon?: string;
	shortcuts?: string[];
	toggle?: boolean;
	hold?: boolean;
	on?: string;
	command?: () => void;
	state?: () => any;
}

export class ActionHandler {
	private readonly actions: Record<string, Record<string, Action>> = {};
	private readonly actionById: Record<string, Action> = {};
	private containers: Record<string, HTMLElement> = {};

	private _holdingToggleAction: Action;

	public getActions() { return Object.values(this.actions); }
	public getAction(id: string) { return id in this.actionById ? this.actionById[id] : null; }

	public setActionCommand(id: string, command: () => void, state?: () => boolean) {
		const action = this.getAction(id);
		if (!action) {
			console.warn(`Could not find action ${id}`);
			return;
		}
		action.command = command;
		action.state = state;
	}

	public addContainer(id: string, container: HTMLElement) { this.containers[id] = container; }

	public enable() {
		Object.keys(this.containers).forEach(cid => {
			const container = this.containers[cid];
			if (!this.actions[cid]) return;
			container.onkeydown = (e: KeyboardEvent) => this.onKeyDown(e, this.actions[cid], container);
			container.onkeyup = this.onKeyUp.bind(this);
		});
	}

	public disable() {
		Object.values(this.containers).forEach(container => {
			container.onkeydown = null;
			container.onkeyup = null;
		});
	}

	public add(...actions: Action[]) {
		actions.forEach(action => {
			const cid = action.on || 'body';
			if (!(cid in this.actions)) this.actions[cid] = {};
			const container = this.actions[cid];

			if (action.shortcuts) {
				action.shortcuts.forEach(s => {
					if (s in container)
						throw new Error(`There is already an action with shortcut ${s}: ${container[s].label}`);
					container[s] = action;
				});
			}

			this.actionById[action.id] = action;
		});
	}

	private onKeyDown(e: KeyboardEvent, actions: Record<string, Action>, container: HTMLElement) {
		if (e.target !== container) return;
		const k = (e.ctrlKey ? 'ctrl+' : '')
			+ (e.shiftKey ? 'shift+' : '')
			+ (e.altKey ? 'alt+' : '')
			+ e.key;
		if (k in actions) {
			const action = actions[k];
			action.command?.();
			if (action.toggle && action.hold)
				this._holdingToggleAction = action;
			e.preventDefault();
		}
	}

	private onKeyUp() {
		if (!this._holdingToggleAction) return;
		this._holdingToggleAction.command?.();
		this._holdingToggleAction = null;
	}
}
