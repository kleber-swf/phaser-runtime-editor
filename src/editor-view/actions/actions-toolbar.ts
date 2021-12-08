import { Action, ActionHandler } from 'core/action-handler';
import { Actions } from 'core/actions';
import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences';
import { Widget } from 'editor-view/widget/widget';
import './actions-toolbar.scss';
import { ActionButton } from './button/action-button';
import { SizeTemplatesPanel } from './size-templates/size-templates-panel';

export class ActionsToolbar extends Widget {
	public static readonly tagName = 'phred-actions-toolbar';

	private readonly buttons: ActionButton[] = [];
	private orientationBtn: ActionButton;
	private orientationPanel: SizeTemplatesPanel;

	public setupActions(actions: ActionHandler) {
		this.createButton(actions.getAction(Actions.TOGGLE_ENABLED));
		this.createSeparator();

		this.createButton(actions.getAction(Actions.TOGGLE_SNAP));
		this.createButton(actions.getAction(Actions.TOGGLE_GUIDES));
		this.createButton(actions.getAction(Actions.TOGGLE_GIZMOS));
		this.createButton(actions.getAction(Actions.TOGGLE_HIT_AREA));
		this.createButton(actions.getAction(Actions.TOGGLE_ALL_HIT_AREAS_SNAPSHOT));

		this.createSeparator();

		this.createButton(actions.getAction(Actions.TOGGLE_RESPONSIVE));
		this.orientationBtn = this.createButton(actions.getAction(Actions.TOGGLE_ORIENTATION));
		this.orientationPanel = this.appendChild(document.createElement(SizeTemplatesPanel.tagName)) as SizeTemplatesPanel;

		this.createSeparator();

		this.createButton(actions.getAction(Actions.ZOOM_OUT));
		this.createButton(actions.getAction(Actions.ZOOM_IN));

		this.createSeparator();
		this.createButton(actions.getAction(Actions.PRINT_OBJECT));
		this.createSeparator();
		this.createButton(actions.getAction(Actions.UNDO));
		this.createSeparator();
		this.createSpacer();

		this.orientationPanel.init();
		Editor.prefs.onPreferenceChanged.add(this.onPreferencesChanged, this);
		this.onPreferencesChanged('responsive', Editor.prefs.responsive);
	}

	private onPreferencesChanged(key: PreferenceKey, value: any) {
		if (key !== 'responsive') return;
		this.orientationBtn.interactable = value === true;
	}

	public enable() { this.buttons.forEach(e => e.updateState()); }

	public disable() { }

	private createButton(action: Action) {
		if (!action) return null;
		const btn = document.createElement(ActionButton.tagName) as ActionButton;
		btn.setAction(action);
		this.appendChild(btn);
		this.buttons.push(btn);
		return btn;
	}

	private createSeparator() {
		this.appendChild(document.createElement('div'))
			.classList.add('separator');
	}

	private createSpacer() {
		this.appendChild(document.createElement('div'))
			.classList.add('spacer');
	}
}

customElements.define(ActionsToolbar.tagName, ActionsToolbar);
