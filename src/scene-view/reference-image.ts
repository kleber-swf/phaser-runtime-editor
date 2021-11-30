import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences';

export class ReferenceImage extends Phaser.Group {
	private _parent: PIXI.DisplayObjectContainer;

	public set image(value: PIXI.Sprite) {
		if (!value) {
			this.visible = false;
			return;
		}

		value.__skip = true;
		if (value.parent !== this) this.addChild(value);
		this.visible = true;
	}

	public get hasImage() { return this.visible; }

	constructor(game: Phaser.Game, root: Container) {
		super(game, null, '__ref_image');
		this.__skip = true;
		this.alpha = 0.3;

		this._parent = root;
		Editor.prefs.onPreferenceChanged.add(this.onPreferenceChanged, this);
	}

	private onPreferenceChanged(pref: PreferenceKey, value: any) {
		if (pref !== 'refImage') return;
		if (value) this.show();
		else this.hide();
	}

	public show() {
		if (!this.parent) this._parent.addChild(this);
	}

	public hide() {
		if (this.parent) this.parent.removeChild(this);
	}

	public enable() {
		this.onPreferenceChanged('refImage', Editor.prefs.refImage);
	}

	public disable() {
		this.hide();
	}
}