import { Action, ActionHandler } from 'core/action-handler';
import { Actions } from 'core/actions';
import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences/preferences.model';
import { PreferencesUtil } from 'core/preferences/preferences.util';
import { ActionButton } from 'editor-view/actions/button/action-button';
import './reference-image-group.scss';

export class ReferenceImageGroup extends HTMLElement {
	public static readonly tagName = 'phred-reference-image-group';

	private optionsButton: HTMLElement;

	public init(actions: ActionHandler) {
		this.classList.add('reference-image-group');

		this.createButton(actions.getAction(Actions.TOGGLE_REF_IMAGE));

		const optionsButton = this.appendChild(document.createElement('div'));
		optionsButton.classList.add('open-options-button', 'button', 'action-button');

		optionsButton.appendChild(document.createElement('i'))
			.classList.add('fas', 'fa-caret-down');

		optionsButton.addEventListener('click', () => {
			Editor.referenceImageController.openOptionsPanel(optionsButton);
		});

		this.optionsButton = optionsButton;

		PreferencesUtil.setupPreferences(
			['referenceImageEnabled', 'referenceImageVisible'],
			this.onPreferencesChanged,
			this
		);
	}

	private createButton(action: Action) {
		if (!action) return null;
		const btn = document.createElement(ActionButton.tagName) as ActionButton;
		btn.setAction(action);
		this.appendChild(btn);
		return btn;
	}

	private onPreferencesChanged(pref: PreferenceKey, value: any) {
		if (pref === 'referenceImageEnabled') {
			this.classList.addOrRemove('disabled', value !== true);
			return;
		}

		if (pref === 'referenceImageVisible') {
			this.optionsButton.classList.addOrRemove('disabled', value !== true);
		}
	}
}

customElements.define(ReferenceImageGroup.tagName, ReferenceImageGroup);
