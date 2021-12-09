import { ActionHandler } from 'core/action-handler';
import { ActionsToolbar } from 'editor-view/actions/actions-toolbar';
import { OldReferenceImagePanel } from 'old-ref-image/reference-image/reference-image-panel';
import { PluginConfig } from 'plugin.model';
import { OldReferenceImage } from './reference-image';

export class OldReferenceImageController {
	private readonly referenceImage: OldReferenceImage;
	private readonly panel: OldReferenceImagePanel;
	private actionsToolbar: ActionsToolbar;

	private image: PIXI.Sprite;

	constructor(game: Phaser.Game, config: PluginConfig) {
		this.referenceImage = new OldReferenceImage(game, config.root);
		this.panel = document.createElement(OldReferenceImagePanel.tagName) as OldReferenceImagePanel;
		this.panel.init(this.referenceImage);
	}

	public setupActions(actions: ActionHandler) {
		this.panel.setupActions(actions);
	}

	public enable(image: Phaser.Image | Phaser.Sprite) {
		if (!this.actionsToolbar) {
			this.actionsToolbar = document.querySelector(ActionsToolbar.tagName);
		}

		if (this.image !== image) {
			this.referenceImage.image = image;
			if (image) {
				if (this.panel.parentElement !== this.actionsToolbar) {
					this.actionsToolbar.appendChild(this.panel);
				}
			} else if (this.panel.parentElement === this.actionsToolbar) {
				this.actionsToolbar.removeChild(this.panel);
			}
		}

		this.referenceImage.enable();
	}

	public disable() {
		this.referenceImage.disable();
	}
}
