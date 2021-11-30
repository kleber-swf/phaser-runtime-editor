import { ComponentTags } from 'component-tags';
import { ActionsToolbar } from 'editor-view/actions/actions-toolbar';
import { ReferenceImagePanel } from 'editor-view/actions/reference-image/reference-image-panel';
import { ActionHandler } from 'index';
import { PluginConfig } from 'plugin';
import { ReferenceImage } from 'scene-view/reference-image';

export class ReferenceImageController {
	private readonly referenceImage: ReferenceImage;
	private readonly panel: ReferenceImagePanel;
	private actionsToolbar: ActionsToolbar;

	private image: PIXI.Sprite;

	constructor(game: Phaser.Game, config: PluginConfig) {
		this.referenceImage = new ReferenceImage(game, config.root);
		this.panel = document.createElement(ComponentTags.ReferenceImagePanel) as ReferenceImagePanel;
		this.panel.init(this.referenceImage);
	}

	public setupActions(actions: ActionHandler) {
		this.panel.setupActions(actions);
	}

	public enable(image: PIXI.Sprite) {
		if (!this.actionsToolbar) {
			this.actionsToolbar = document.querySelector(ComponentTags.ActionsToolbar);
		}

		if (this.image !== image) {
			this.referenceImage.image = image;

			if (image) {
				this.actionsToolbar.appendChild(this.panel);
			} else {
				this.actionsToolbar.removeChild(this.panel);
			}
		}

		this.referenceImage.enable();
	}

	public disable() {
		this.referenceImage.disable();
	}
}