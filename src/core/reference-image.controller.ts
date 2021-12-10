import { ReferenceImagePanel } from 'editor-view/actions/reference-image/reference-image.panel';
import { PluginConfig } from 'plugin.model';
import { ReferenceImage } from 'scene-view/reference-image/reference-image';
import { Preferences } from './preferences/preferences';

export class ReferenceImageController {
	private prefs: Preferences;
	private image: ReferenceImage;

	public createImage(parent: HTMLElement) {
		this.image = document.createElement(ReferenceImage.tagName) as ReferenceImage;
		this.image.init();
		parent.appendChild(this.image);
	}

	public constructor(prefs: Preferences) {
		this.prefs = prefs;
	}

	public enable(config: PluginConfig) {
		this.image.enable(config, this.prefs.get('referenceImageFilters'));
	}

	public showPanel(opener: HTMLElement) {
		const p = (document.createElement(ReferenceImagePanel.tagName) as ReferenceImagePanel);
		p.openPopup('Reference Image Options', opener, this.image);
		p.addEventListener('closed', () => this.prefs.set('referenceImageFilters', this.image.getFilters()));
	}
}
