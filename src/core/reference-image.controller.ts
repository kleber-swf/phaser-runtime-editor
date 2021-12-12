import { PluginConfig, Size } from 'plugin.model';
import { ReferenceImage } from 'scene-view/reference-image/reference-image';
import { Preferences } from './preferences/preferences';
import { PreferenceKey } from './preferences/preferences.model';

export class ReferenceImageController {
	private game: Phaser.Game;
	private prefs: Preferences;
	private config: PluginConfig;

	public image: ReferenceImage;

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
		this.onPreferencesChanged('referenceImageVisible', this.prefs.get('referenceImageVisible'));
		this.image.enable(this.prefs.get('referenceImageFilters'));
	}

	private onPreferencesChanged(key: PreferenceKey, value: any) {
		switch (key) {
			case 'referenceImageVisible':
				this.image.visible = value === true;
				break;
			case 'responsive':
				{
					const size = value ? this.prefs.get('responsiveSize') as Size
						: { width: this.game.width, height: this.game.height };
					this.image.source = this.config.referenceImageUrl(size.width, size.height, value);
				}
				break;
			case 'responsiveSize':
				this.image.source = this.config.referenceImageUrl(value.width, value.height, true);
				break;
		}
	}

	private onImageLoaded(e: CustomEvent) {
		this.prefs.set('referenceImageEnabled', e.detail === true);
	}
}
