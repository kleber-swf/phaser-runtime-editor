import { Actions } from 'actions';
import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences';
import { ActionButton } from '../button/action-button';
import './reference-image-panel.scss';

export class ReferenceImagePanel extends HTMLElement {
	public static readonly tagName: string = 'phred-reference-image-panel';
	private slider: HTMLInputElement;

	public init() {
		const btn = document.createElement(ActionButton.tagName) as ActionButton;
		btn.setAction(Editor.actions.getAction(Actions.TOGGLE_REF_IMAGE));
		this.appendChild(btn);

		const slider = this.slider = document.createElement('input');
		slider.type = 'range';
		slider.min = '0';
		slider.max = '1';
		slider.step = '0.05';
		slider.oninput = () => Editor.referenceImage.alpha = parseFloat(slider.value);
		this.appendChild(slider);

		Editor.prefs.onPreferenceChanged.add(this.onPreferenceChanged, this);
		this.onPreferenceChanged('referenceImage', Editor.prefs.referenceImage);
		slider.value = Editor.referenceImage.alpha.toString();
	}

	private onPreferenceChanged(pref: PreferenceKey, value: any) {
		if (pref !== 'referenceImage') return;
		if (value) this.slider.removeAttribute('disabled');
		else this.slider.setAttribute('disabled', 'true');
	}
}

customElements.define(ReferenceImagePanel.tagName, ReferenceImagePanel);
