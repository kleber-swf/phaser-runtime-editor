import { Editor } from 'core/editor';
import { PreferenceKey } from 'index';

export class ReferenceImage extends Phaser.Group {
	private image: PIXI.Sprite;

	constructor(game: Phaser.Game, image: PIXI.Sprite) {
		super(game, null, '__ref_image');
		this.__skip = true;
		this.addChild(image);
		this.image = image;
		this.alpha = 0.3;
		image.blendMode = PIXI.blendModes.DARKEN;
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