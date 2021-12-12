import { ActionHandler } from 'core/action-handler';
import { Actions } from 'core/actions';
import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences/preferences.model';
import { PreferencesUtil } from 'core/preferences/preferences.util';
import { ActionView } from 'editor-view/actions/action-view';
import { ActionButton } from 'editor-view/actions/button/action-button';
import { ReferenceImageOptions } from '../options/reference-image.options';
import './reference-image-group.scss';

export class ReferenceImageGroup extends HTMLElement implements ActionView {
	public static readonly tagName = 'phred-reference-image-group';

	private button: ActionButton;
	private optionsButton: HTMLElement;

	public init(actions: ActionHandler) {
		this.classList.add('reference-image-group');
		this.button = this.createButton(actions);

		const optionsButton = this.appendChild(document.createElement('div'));
		optionsButton.classList.add('open-options-button', 'button', 'action-button');

		optionsButton.appendChild(document.createElement('i'))
			.classList.add('fas', 'fa-caret-down');

		optionsButton.addEventListener('click', this.openOptions.bind(this));

		this.optionsButton = optionsButton;

		PreferencesUtil.setupPreferences(
			['referenceImageEnabled', 'referenceImageVisible'],
			this.onPreferencesChanged,
			this
		);
	}

	private createButton(actions: ActionHandler) {
		const btn = document.createElement(ActionButton.tagName) as ActionButton;
		btn.setAction(actions.getAction(Actions.TOGGLE_REF_IMAGE));
		this.appendChild(btn);
		return btn;
	}

	public updateState() {
		this.button.updateState();
	}

	private openOptions() {
		const image = Editor.referenceImageController.image;
		const p = (document.createElement(ReferenceImageOptions.tagName) as ReferenceImageOptions);
		p.openPopup('Reference Image Options', this.optionsButton, image);
		p.addEventListener('closed', () => Editor.prefs.set('referenceImageFilters', image.getFilters()));
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
