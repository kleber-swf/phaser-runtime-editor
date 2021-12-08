import { ComponentTags } from 'component-tags';
import { Actions } from 'core/actions';
import { EditorData } from 'data/editor-data';
import { InspectorData } from 'data/inspector-data';
import { PhaserMeta } from 'data/phaser-meta';
import { PluginConfig } from 'plugin.model';
import { ActionHandler } from './action-handler';
import { History } from './history';
import { Preferences } from './preferences';

class EditorClass {
	public data: EditorData;
	public inspectorData: InspectorData;
	public meta: PhaserMeta;

	public actions: ActionHandler;
	public history: History;
	public prefs: Preferences;

	public init(config: PluginConfig) {
		this.data = new EditorData();
		this.inspectorData = this.createInspectorData();
		this.meta = new PhaserMeta();

		this.actions = this.createActions();
		this.history = new History(this.data);
		this.prefs = new Preferences(config.clearPrefs);
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

			// custom
			color: ComponentTags.ColorPropertyEditor,
			valueList: ComponentTags.ValueListPropertyEditor,

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
			{ name: 'blendMode', typeHint: 'valueList', values: Phaser.blendModes },
			{ name: 'tint', typeHint: 'color' },
			// TODO waiting for multiple type hint
			// { name: 'hitArea', typeHint: 'rect' },

			// Text
			{ name: 'text', typeHint: 'text', data: { rows: 3 } },
			{ name: 'font', typeHint: 'string' },
			{ name: 'fontSize', typeHint: 'number', data: { min: 0, step: 1 } },
			{ name: 'fontStyle', typeHint: 'valueList', values: ['normal', 'italic', 'oblique'] },
			{ name: 'fontWeight', typeHint: 'valueList', values: ['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900'] },
			{ name: 'fontVariant', typeHint: 'valueList', values: ['normal', 'small-caps'] },
			{ name: 'autoRound', typeHint: 'boolean' },
			{ name: 'align', typeHint: 'valueList', values: ['left', 'center', 'right'] },
			{ name: 'wordWrap', typeHint: 'boolean' },
			{ name: 'wordWrapWidth', typeHint: 'number', data: { min: 0, step: 1 } },
			{ name: 'useAdvancedWordWrap', typeHint: 'boolean' },
			{ name: 'padding', typeHint: 'point' },
			// { name: 'textBounds', typeHint: 'rect' },  // TODO waiting for null checking on rect editor
			{ name: 'boundsAlignH', typeHint: 'valueList', values: ['left', 'center', 'right'] },
			{ name: 'boundsAlignV', typeHint: 'valueList', values: ['top', 'middle', 'bottom'] },
		]);

		const basicProperties = {
			title: '',
			properties: [
				'__type',
				'name',
				'position',
				'scale',
				'pivot',
				'anchor',
				'alpha',
				'visible',
				'angle',
				'_bounds',
			],
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
					'text',
					'font',
					'fontSize',
					'fontStyle',
					'fontVariant',
					'fontWeight',
					'autoRound',
					'divider',
					'align',
					'wordWrap',
					'wordWrapWidth',
					'useAdvancedWordWrap',
					'divider',
					'padding', /* 'textBounds', */
					'boundsAlignH',
					'boundsAlignV',
				],
			},
		]);

		data.addObjectProperties('Phaser.BitmapText', [
			basicProperties,
			{ title: 'Sprite', properties: ['tint'] },
			{ title: 'Bitmap Text', properties: ['font', 'fontSize', 'align'] },
		]);

		return data;
	}

	private createActions() {
		const actions = new ActionHandler();
		actions.add(
			{
				id: Actions.TOGGLE_ENABLED,
				label: 'edit',
				icon: 'fa-edit',
			},

			{
				id: Actions.TOGGLE_SNAP,
				label: 'snap',
				icon: 'fa-border-all',
				toggle: true,
			},
			{
				id: Actions.TOGGLE_GIZMOS,
				label: 'gizmos',
				icon: 'fa-vector-square',
				toggle: true,
				hold: true,
				shortcuts: ['ctrl+shift+Shift', 'ctrl+shift+Control'],
			},
			{
				id: Actions.TOGGLE_GUIDES,
				toggle: true,
				label: 'guides',
				icon: 'fa-compress',
			},
			{
				id: Actions.TOGGLE_HIT_AREA,
				toggle: true,
				label: 'hit area',
				icon: 'fa-hand-point-up',
			},
			{
				id: Actions.TOGGLE_ALL_HIT_AREAS_SNAPSHOT,
				toggle: true,
				label: 'all hit areas snapshot',
				icon: 'fa-layer-group',
			},
			{
				id: Actions.TOGGLE_RESPONSIVE,
				toggle: true,
				label: 'responsive',
				icon: 'fa-tablet-alt',
			},
			{
				id: Actions.TOGGLE_ORIENTATION,
				label: 'orientation',
				icon: 'fa-retweet',
			},
			{
				id: Actions.TOGGLE_REF_IMAGE,
				toggle: true,
				label: 'reference image',
				icon: 'fa-image',
			},
			{
				id: Actions.UNDO,
				label: 'undo',
				icon: 'fa-undo-alt',
				shortcuts: ['ctrl+z'],
			},

			{
				id: Actions.PRINT_OBJECT,
				label: 'print',
				icon: 'fa-terminal',
				shortcuts: ['ctrl+alt+p'],
			},

			{ id: Actions.DESELECT, shortcuts: ['Escape'] },
			{ id: Actions.MOVE_UP_1, shortcuts: ['ArrowUp'] },
			{ id: Actions.MOVE_DOWN_1, shortcuts: ['ArrowDown'] },
			{ id: Actions.MOVE_LEFT_1, shortcuts: ['ArrowLeft'] },
			{ id: Actions.MOVE_RIGHT_1, shortcuts: ['ArrowRight'] },
			{ id: Actions.MOVE_UP_10, shortcuts: ['shift+ArrowUp'] },
			{ id: Actions.MOVE_DOWN_10, shortcuts: ['shift+ArrowDown'] },
			{ id: Actions.MOVE_LEFT_10, shortcuts: ['shift+ArrowLeft'] },
			{ id: Actions.MOVE_RIGHT_10, shortcuts: ['shift+ArrowRight'] },

			{ id: Actions.ZOOM, shortcuts: ['ctrl+wheel'] },
			{ id: Actions.ZOOM_IN, label: 'zoom in', icon: 'fa-search-plus', shortcuts: ['ctrl+=', 'ctrl++'] },
			{ id: Actions.ZOOM_OUT, label: 'zoom out', icon: 'fa-search-minus', shortcuts: ['ctrl+-'] }
		);

		return actions;
	}

	public setupInitialActions() {
		const actions = this.actions;
		this.prefs.setupActions(actions);
		this.history.setupActions(actions);
		this.data.setupActions(actions);
	}

	public enable() {
		this.actions.enable();
	}

	public disable() {
		this.actions.disable();
	}
}

export const Editor = new EditorClass();
