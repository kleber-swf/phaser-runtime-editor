import { ComponentTags } from 'component-tags';
import { Actions } from 'core/actions';
import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences';
import { ActionHandler } from 'index';
import { ReferenceImage } from 'scene-view/reference-image';
import { ActionButton } from '../button/action-button';
import './reference-image-panel.scss';

export class ReferenceImagePanel extends HTMLElement {
	private button: ActionButton;
	private slider: HTMLInputElement;

	public init(image: ReferenceImage) {
		const btn = this.button = document.createElement(ComponentTags.ActionButton) as ActionButton;
		this.appendChild(btn);

		const slider = this.slider = document.createElement('input');
		slider.type = 'range';
		slider.min = '0';
		slider.max = '1';
		slider.step = '0.05';
		slider.oninput = () => image.alpha = parseFloat(slider.value);
		slider.value = image.alpha.toString();
		this.appendChild(slider);

		Editor.prefs.onPreferenceChanged.add(this.onPreferenceChanged, this);
		this.onPreferenceChanged('refImageVisible', Editor.prefs.refImageVisible);
	}

	public setupActions(actions: ActionHandler) {
		this.button.setAction(actions.getAction(Actions.TOGGLE_REF_IMAGE));
	}

	private onPreferenceChanged(pref: PreferenceKey, value: any) {
		if (pref !== 'refImageVisible') return;
		if (value) this.slider.removeAttribute('disabled');
		else this.slider.setAttribute('disabled', 'true');
	}
}

customElements.define(ComponentTags.ReferenceImagePanel, ReferenceImagePanel);
