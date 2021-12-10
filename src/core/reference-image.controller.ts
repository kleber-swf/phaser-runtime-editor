import { ReferenceImageOptions } from 'editor-view/actions/reference-image/reference-image.options';
import { PluginConfig, Size } from 'plugin.model';
import { ReferenceImage } from 'scene-view/reference-image/reference-image';
import { Preferences } from './preferences/preferences';
import { PreferenceKey } from './preferences/preferences.model';

export class ReferenceImageController {
	private game: Phaser.Game;
	private prefs: Preferences;
	private image: ReferenceImage;
	private config: PluginConfig;

	public createImage(parent: HTMLElement) {
		this.image = document.createElement(ReferenceImage.tagName) as ReferenceImage;
		this.image.init();
		this.image.addEventListener('imageLoaded', this.onImageLoaded.bind(this));
		parent.appendChild(this.image);
	}

	public constructor(game: Phaser.Game, prefs: Preferences) {
		this.game = game;
		this.prefs = prefs;
		prefs.onChange.add(this.onPreferencesChanged, this);
	}

	public enable(config: PluginConfig) {
		this.config = config;
		this.onPreferencesChanged('responsive', this.prefs.get('responsive'));
		this.image.enable(this.prefs.get('referenceImageFilters'));
	}

	public openOptionsPanel(opener: HTMLElement) {
		const p = (document.createElement(ReferenceImageOptions.tagName) as ReferenceImageOptions);
		p.openPopup('Reference Image Options', opener, this.image);
		p.addEventListener('closed', () => this.prefs.set('referenceImageFilters', this.image.getFilters()));
	}

	private onPreferencesChanged(key: PreferenceKey, value: any) {
		if (key === 'responsive') {
			const size = value ? this.prefs.get('responsiveSize') as Size
				: { width: this.game.width, height: this.game.height };
			this.image.source = this.config.referenceImageUrl(size.width, size.height);
		} else if (key === 'responsiveSize') {
			this.image.source = this.config.referenceImageUrl(value.width, value.height);
		}
	}

	private onImageLoaded(e: CustomEvent) {
		this.prefs.set('referenceImageEnabled', e.detail === true);
	}
}
