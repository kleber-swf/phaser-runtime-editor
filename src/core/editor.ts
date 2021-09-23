import { ComponentTags } from 'component-tags';
import { EditorData } from 'data/editor-data';
import { InspectorData } from 'data/inspector-data';
import { PhaserMeta } from 'data/phaser-meta';
import { ActionHandler } from './action-handler';
import { History } from './history';
import { Preferences } from './preferences';

class EditorClass {
	public data: EditorData
	public inspectorData: InspectorData;
	public meta: PhaserMeta;

	public actions: ActionHandler;
	public history: History;
	public prefs: Preferences;

	// public referenceImage?: ReferenceImage;

	public init(clearPrefs: boolean) {
		this.data = new EditorData();
		this.inspectorData = this.createInspectorData();
		this.meta = new PhaserMeta();

		this.actions = new ActionHandler();
		this.history = new History(this.data);
		this.prefs = new Preferences(clearPrefs);
	}

	private createInspectorData() {
		const data = new InspectorData();
		data.addTypeEditors({
			// basic types
			string: ComponentTags.StringPropertyEditor,
			text: ComponentTags.TextPropertyEditor,
			number: ComponentTags.NumberPropertyEditor,
			boolean: ComponentTags.BooleanPropertyEditor,

			// PIXI/Phaser types
			point: ComponentTags.PointPropertyEditor,
			rect: ComponentTags.RectPropertyEditor,

			// default
			default: ComponentTags.StringPropertyEditor,
		});

		data.addInspectableProperties([
			{ name: '__type', label: 'type', typeHint: 'string', data: { readonly: true } },
			{ name: 'name', typeHint: 'string' },
			{ name: 'position', typeHint: 'point' },
			{ name: 'scale', typeHint: 'point', data: { step: 0.1 } },
			{ name: 'pivot', typeHint: 'point' },
			{ name: 'anchor', typeHint: 'point', data: { step: 0.1 } },
			{ name: 'alpha', typeHint: 'number', data: { min: 0, max: 1, step: 0.1 } },
			{ name: 'visible', typeHint: 'boolean' },
			{ name: 'angle', typeHint: 'number', data: { readonly: true } },
			{ name: '_bounds', label: 'bounds', typeHint: 'rect', data: { readonly: true } },

			// Sprite
			{ name: 'key', typeHint: 'string' },
			{ name: 'frameName', label: 'frame', typeHint: 'string' },
			{ name: 'blendMode', typeHint: 'number' },
			{ name: 'tint', typeHint: 'number', data: { min: 0, max: 0xFFFFFF } },

			// Text
			{ name: 'text', typeHint: 'text', data: { rows: 3 } },
			{ name: 'font', typeHint: 'string' },
			{ name: 'fontSize', typeHint: 'number', data: { min: 0, step: 1 } },
			{ name: 'fontStyle', typeHint: 'string' },
			{ name: 'fontVariant', typeHint: 'string' },
			{ name: 'fontWeight', typeHint: 'string' },
			{ name: 'autoRound', typeHint: 'boolean' },
			{ name: 'align', typeHint: 'string' },
			{ name: 'wordWrap', typeHint: 'boolean' },
			{ name: 'wordWrapWidth', typeHint: 'number', data: { min: 0, step: 1 } },
			{ name: 'useAdvancedWordWrap', typeHint: 'boolean' },
			{ name: 'padding', typeHint: 'point' },
			// { name: 'textBounds', typeHint: 'rect' },  // TODO waiting for null checking on rect editor
			{ name: 'boundsAlignH', typeHint: 'string' },
			{ name: 'boundsAlignV', typeHint: 'string' },

		]);

		const basicProperties = {
			title: '', properties: [
				'__type', 'name', 'position', 'scale', 'pivot', 'anchor',
				'alpha', 'visible', 'angle', '_bounds'
			]
		};

		data.addObjectProperties('default', [basicProperties]);

		data.addObjectProperties('Phaser.Sprite', [
			basicProperties,
			{ title: 'Sprite', properties: ['key', 'frameName', 'blendMode', 'tint'] },
		]);

		data.addObjectProperties('Phaser.Image', [
			basicProperties,
			{ title: 'Sprite', properties: ['key', 'frameName', 'blendMode', 'tint'] },
		]);

		data.addObjectProperties('Phaser.Graphics', [
			basicProperties,
			{ title: 'Sprite', properties: ['blendMode', 'tint'] },
		]);

		data.addObjectProperties('Phaser.Text', [
			basicProperties,
			{ title: 'Sprite', properties: ['blendMode', 'tint'] },
			{
				title: 'Text',
				properties: [
					'text', 'font', 'fontSize', 'fontStyle', 'fontVariant', 'fontWeight', 'autoRound',
					'divider',
					'align', 'wordWrap', 'wordWrapWidth', 'useAdvancedWordWrap',
					'divider',
					'padding', /*'textBounds', */'boundsAlignH', 'boundsAlignV']
			},
		]);

		data.addObjectProperties('Phaser.BitmapText', [
			basicProperties,
			{ title: 'Sprite', properties: ['tint'] },
			{ title: 'Bitmap Text', properties: ['font', 'fontSize', 'align'] },
		]);

		return data;
	}


	public enable() {
		this.actions.enable();
	}

	public disable() {
		this.actions.enable();
		// if (this.referenceImage) this.prefs.referenceImage = false;
	}
}

export const Editor = new EditorClass();
