import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences';

export class ReferenceImage extends Phaser.Group {
	private _parent: PIXI.DisplayObjectContainer;

	public set image(value: Phaser.Image|Phaser.Sprite) {
		if (!value) {
			this.visible = false;
			return;
		}

		value.__skip = true;
		
		if (value.parent !== this) {
			this.addChild(value);
			value.inputEnabled = true;
			value.input.draggable = true;
			value.events.onDragStop.add(() => {
				Editor.prefs.refImageX = value.x;
				Editor.prefs.refImageY = value.y;
			});
		}
		this.visible = true;
	}

	public get hasImage() { return this.visible; }

	constructor(game: Phaser.Game, root: Container) {
		super(game, null, '__ref_image');
		this.__skip = true;
		this.alpha = 0.3;

		this._parent = root;

		const prefs = Editor.prefs;
		prefs.onPreferenceChanged.add(this.onPreferenceChanged, this);
		this.onPreferenceChanged('refImageVisible', prefs.refImageVisible);
		// TODO waiting for proportional scaling
		// this.onPreferenceChanged('refImageScaleX', prefs.refImageScaleX);
		// this.onPreferenceChanged('refImageScaleY', prefs.refImageScaleY);

		this.visible = false;
	}

	private onPreferenceChanged(pref: PreferenceKey, value: any) {
		if (pref !== 'refImageVisible') return;
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