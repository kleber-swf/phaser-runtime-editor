import { Action, ActionHandler } from 'core/action-handler';
import { Actions } from 'core/actions';
import { PreferenceKey } from 'core/preferences/preferences.model';
import { PreferencesUtil } from 'core/preferences/preferences.util';
import { Widget } from 'editor-view/widget/widget';
import { ActionView } from './action-view';
import './actions-toolbar.scss';
import { ActionButton } from './button/action-button';
import { ReferenceImageGroup } from './reference-image/group/reference-image-group';
import { ResponsiveGroup } from './responsive/responsive-group';

export class ActionsToolbar extends Widget {
	public static readonly tagName = 'phred-actions-toolbar';

	private readonly views: ActionView[] = [];

	private leftPanelToggle: HTMLElement;
	private rightPanelToggle: HTMLElement;

	public setupActions(actions: ActionHandler) {
		this.classList.add('actions-toolbar');
		this.createButton(actions.getAction(Actions.TOGGLE_ENABLED));
		this.createSeparator();

		this.createButton(actions.getAction(Actions.TOGGLE_SNAP));
		this.createButton(actions.getAction(Actions.TOGGLE_GUIDES));
		this.createButton(actions.getAction(Actions.TOGGLE_GIZMOS));
		this.createButton(actions.getAction(Actions.TOGGLE_HIT_AREA));
		this.createButton(actions.getAction(Actions.TOGGLE_HIT_AREAS_SNAPSHOT));

		this.createSeparator();
		this.createResponsiveGroup(actions);
		this.createSeparator();

		this.createButton(actions.getAction(Actions.ZOOM_OUT));
		this.createButton(actions.getAction(Actions.ZOOM_RESET));
		this.createButton(actions.getAction(Actions.ZOOM_IN));

		this.createSeparator();
		this.createButton(actions.getAction(Actions.PRINT_OBJECT));
		this.createReferenceImageGroup(actions);
		this.createSeparator();
		this.createButton(actions.getAction(Actions.UNDO));
		this.createSeparator();
		this.createButton(actions.getAction(Actions.HELP));
		this.createSeparator();
		this.createSpacer();

		const leftPanelToggle = this.appendChild(document.createElement('div'));
		leftPanelToggle.classList.add('left', 'panel-toggle', 'fa');
		leftPanelToggle.addEventListener('click', () => actions.getAction(Actions.TOGGLE_LEFT_PANEL).command());
		this.leftPanelToggle = leftPanelToggle;

		const rightPanelToggle = this.appendChild(document.createElement('div'));
		rightPanelToggle.classList.add('right', 'panel-toggle', 'fa');
		rightPanelToggle.addEventListener('click', () => actions.getAction(Actions.TOGGLE_RIGHT_PANEL).command());
		this.rightPanelToggle = rightPanelToggle;

		PreferencesUtil.setupPreferences(
			['leftPanelVisible', 'rightPanelVisible'],
			this.onPreferencesChanged,
			this
		);
	}

	public enable() { this.views.forEach(e => e.updateState()); }

	public disable() { }

	private createButton(action: Action, parent?: HTMLElement) {
		if (!action) return null;
		const btn = document.createElement(ActionButton.tagName) as ActionButton;
		btn.setAction(action);
		(parent ?? this).appendChild(btn);
		this.views.push(btn);
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

	private createResponsiveGroup(actions: ActionHandler) {
		const group = document.createElement(ResponsiveGroup.tagName) as ResponsiveGroup;
		group.init(actions);
		this.views.push(group);
		this.appendChild(group);
	}

	private createReferenceImageGroup(actions: ActionHandler) {
		const group = document.createElement(ReferenceImageGroup.tagName) as ReferenceImageGroup;
		group.init(actions);
		this.views.push(group);
		this.appendChild(group);
	}

	private onPreferencesChanged(key: PreferenceKey, value: any) {
		switch (key) {
			case 'leftPanelVisible':
				this.leftPanelToggle.classList.addOrRemove('is-hidden', value !== true);
				break;
			case 'rightPanelVisible':
				this.rightPanelToggle.classList.addOrRemove('is-hidden', value !== true);
				break;
		}
	}
}

customElements.define(ActionsToolbar.tagName, ActionsToolbar);
