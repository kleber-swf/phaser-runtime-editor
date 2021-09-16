import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences';

export class ReferenceImage extends Phaser.Group {
	constructor(game: Phaser.Game, image: PIXI.Sprite) {
		super(game, null, '__ref_image');
		this.__skip = true;
		this.addChild(image);
		image.width = this.game.width;
		image.height = this.game.height;
		this.alpha = 0.3;

		Editor.prefs.onPreferenceChanged.add(this.onPreferenceChanged, this);
		this.onPreferenceChanged('referenceImage', Editor.prefs.referenceImage);
	}

	private onPreferenceChanged(pref: PreferenceKey, value: any) {
		if (pref !== 'referenceImage') return;
		if (value) this.show();
		else this.hide();
	}

	public show() {
		if (!this.parent) this.game.stage.add(this);
	}

	public hide() {
		if (this.parent) this.parent.removeChild(this);
	}
}