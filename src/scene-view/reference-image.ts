import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences';

export class ReferenceImage extends Phaser.Group {
	private _parent: PIXI.DisplayObjectContainer;

	constructor(game: Phaser.Game, image: PIXI.Sprite, root: Container) {
		super(game, null, '__ref_image');
		this.__skip = true;
		image.__skip = true;
		this.addChild(image);
		this.alpha = 0.3;

		this._parent = root;

		Editor.prefs.onPreferenceChanged.add(this.onPreferenceChanged, this);
		this.onPreferenceChanged('referenceImage', Editor.prefs.referenceImage);
	}

	private onPreferenceChanged(pref: PreferenceKey, value: any) {
		if (pref !== 'referenceImage') return;
		if (value) this.show();
		else this.hide();
	}

	public show() {
		if (!this.parent) this._parent.addChild(this);
	}

	public hide() {
		if (this.parent) this.parent.removeChild(this);
	}
}