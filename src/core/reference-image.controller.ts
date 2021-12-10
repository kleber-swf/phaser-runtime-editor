import { ReferenceImagePanel } from 'editor-view/actions/reference-image/reference-image.panel';
import { PluginConfig } from 'plugin.model';
import { ReferenceImage } from 'scene-view/reference-image/reference-image';

export class ReferenceImageController {
	private image: ReferenceImage;

	public createImage(parent: HTMLElement) {
		this.image = document.createElement(ReferenceImage.tagName) as ReferenceImage;
		this.image.init();
		parent.appendChild(this.image);
	}

	public enable(config: PluginConfig) {
		this.image.enable(config);
	}

	public showPanel(opener: HTMLElement) {
		(document.createElement(ReferenceImagePanel.tagName) as ReferenceImagePanel)
			.openPopup('Reference Image Options', opener, this.image);
	}
}
