import { Editor } from './editor';
import { PropertiesPanel } from './properties.panel';

export class EditorContainer extends Phaser.Group {
	/**
	 * @param {Phaser.Game} game
	 * @param {Phaser.Group} root
	 */
	constructor(game, root) {
		super(game, null, '_Runtime_Editor_Container_');
		const editor = new Editor(game, root);
		this.editor = editor;
		const panel = new PropertiesPanel(game, 'Properties');
		panel.visible = false;
		this.panel = panel;
		this.add(editor);
		this.add(panel);
		editor.onObjectSelected.add(panel.onObjectSelected, panel);
		this.visible = false;
	}

	toggleVisible() {
		this.visible = !this.visible;
		if (!this.visible) {
			this.game.scale.onSizeChange.remove(this.onSizeChange, this);
			return;
		}
		this.game.scale.onSizeChange.add(this.onSizeChange, this);
		this.panel.position.set(this.game.width - this.panel.width, 0);
		this.onSizeChange();
	}

	onSizeChange() {
		this.editor.onSizeChange();
	}
}
