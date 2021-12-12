import { Action, ActionHandler } from 'core/action-handler';
import { Actions } from 'core/actions';
import { PreferenceKey } from 'core/preferences/preferences.model';
import { PreferencesUtil } from 'core/preferences/preferences.util';
import { ActionView } from '../action-view';
import { ActionButton } from '../button/action-button';
import { SizeTemplatesPanel } from '../size-templates/size-templates-panel';
import './responsive-group.scss';

export class ResponsiveGroup extends HTMLElement implements ActionView {
	public static readonly tagName = 'phred-responsive-group';

	private toggleButton: ActionButton;
	private orientationButton: ActionButton;
	private orientationTemplates: SizeTemplatesPanel;

	public init(actions: ActionHandler) {
		this.toggleButton = this.createButton(actions.getAction(Actions.TOGGLE_RESPONSIVE));
		this.orientationButton = this.createButton(actions.getAction(Actions.TOGGLE_ORIENTATION));
		this.orientationTemplates = this.appendChild(document.createElement(SizeTemplatesPanel.tagName)) as SizeTemplatesPanel;
		this.orientationTemplates.init();
		PreferencesUtil.setupPreferences(['responsive'], this.onPreferencesChanged, this);
	}

	private createButton(action: Action) {
		const btn = document.createElement(ActionButton.tagName) as ActionButton;
		btn.setAction(action);
		this.appendChild(btn);
		return btn;
	}

	private onPreferencesChanged(key: PreferenceKey, value: any) {
		if (key === 'responsive') {
			this.orientationButton.interactable = value === true;
			this.orientationTemplates.interactable = value === true;
		}
	}

	public updateState(): void {
		this.toggleButton.updateState();
		this.orientationButton.updateState();
	}
}

customElements.define(ResponsiveGroup.tagName, ResponsiveGroup);
