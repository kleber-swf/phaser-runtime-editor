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
	private orientationTemplates: SizeTemplatesPanel;

	private leftPanelToggle: HTMLElement;
	private rightPanelToggle: HTMLElement;

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
		this.orientationTemplates = this.appendChild(document.createElement(SizeTemplatesPanel.tagName)) as SizeTemplatesPanel;

		this.createSeparator();

		this.createButton(actions.getAction(Actions.ZOOM_OUT));
		this.createButton(actions.getAction(Actions.ZOOM_RESET));
		this.createButton(actions.getAction(Actions.ZOOM_IN));

		this.createSeparator();
		this.createButton(actions.getAction(Actions.PRINT_OBJECT));
		this.createReferenceImagePanel(actions.getAction(Actions.TOGGLE_REF_IMAGE));
		this.createSeparator();
		this.createButton(actions.getAction(Actions.UNDO));
		this.createSeparator();
		this.createButton(actions.getAction(Actions.HELP));
		this.createSeparator();
		this.createSpacer();

		this.orientationTemplates.init();

		const leftPanelToggle = this.appendChild(document.createElement('div'));
		leftPanelToggle.classList.add('left', 'panel-toggle', 'fa');
		leftPanelToggle.addEventListener('click', () => actions.getAction(Actions.TOGGLE_LEFT_PANEL).command());
		this.leftPanelToggle = leftPanelToggle;

		const rightPanelToggle = this.appendChild(document.createElement('div'));
		rightPanelToggle.classList.add('right', 'panel-toggle', 'fa');
		rightPanelToggle.addEventListener('click', () => actions.getAction(Actions.TOGGLE_RIGHT_PANEL).command());
		this.rightPanelToggle = rightPanelToggle;

		this.onPreferencesChanged('responsive', Editor.prefs.responsive);
		this.onPreferencesChanged('leftPanelVisible', Editor.prefs.leftPanelVisible);
		this.onPreferencesChanged('rightPanelVisible', Editor.prefs.rightPanelVisible);
		Editor.prefs.onPreferenceChanged.add(this.onPreferencesChanged, this);
	}

	private onPreferencesChanged(key: PreferenceKey, value: any) {
		switch (key) {
			case 'responsive':
				this.orientationBtn.interactable = value === true;
				this.orientationTemplates.interactable = value === true;
				break;
			case 'leftPanelVisible':
				if (value === true) {
					this.leftPanelToggle.classList.remove('is-hidden');
				} else {
					this.leftPanelToggle.classList.add('is-hidden');
				}
				break;
			case 'rightPanelVisible':
				if (value === true) {
					this.rightPanelToggle.classList.remove('is-hidden');
				} else {
					this.rightPanelToggle.classList.add('is-hidden');
				}
				break;
		}
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

	private createReferenceImagePanel(action: Action) {
		this.createButton(action);

		const optionsButton = this.appendChild(document.createElement('div'));
		optionsButton.classList.add('open-options-button', 'button', 'action-button');

		optionsButton.appendChild(document.createElement('i'))
			.classList.add('fas', 'fa-caret-down');

		optionsButton.addEventListener('click', () => {
			Editor.referenceImageController.showPanel(optionsButton);
		});
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
