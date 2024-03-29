import { Actions } from 'core/actions';
import { DataOrigin, EditorData } from 'data/editor-data';
import { InspectorData } from 'data/inspector-data';
import { PhaserMeta } from 'data/phaser-meta';
import { PluginConfig } from 'plugin.model';
import { PropertyElementTag } from 'property-element-tag';
import { ActionHandler } from './action-handler';
import { ActionsSetup } from './actions-setup';
import { History } from './history';
import { Preferences } from './preferences/preferences';
import { ReferenceImageController } from './reference-image.controller';

class EditorClass {
	public data: EditorData;
	public inspectorData: InspectorData;
	public meta: PhaserMeta;

	public actions: ActionHandler;
	public history: History;
	public prefs: Preferences;

	public referenceImageController: ReferenceImageController;

	public init(game: Phaser.Game, config: PluginConfig) {
		this.data = new EditorData();
		this.inspectorData = this.createInspectorData();
		this.meta = new PhaserMeta();

		this.actions = this.createActions();
		this.history = new History(this.data);
		this.prefs = new Preferences(config.clearPreferences);

		this.referenceImageController = new ReferenceImageController(game, this.prefs);
	}

	private createInspectorData() {
		const data = new InspectorData();
		data.addTypeEditors({
			// basic types
			string: PropertyElementTag.StringPropertyEditor,
			text: PropertyElementTag.TextPropertyEditor,
			number: PropertyElementTag.NumberPropertyEditor,
			boolean: PropertyElementTag.BooleanPropertyEditor,

			// PIXI/Phaser types
			point: PropertyElementTag.PointPropertyEditor,
			rect: PropertyElementTag.RectPropertyEditor,

			// custom
			color: PropertyElementTag.ColorPropertyEditor,
			cssColor: PropertyElementTag.CssColorPropertyEditor,
			valueList: PropertyElementTag.ValueListPropertyEditor,

			// default
			default: PropertyElementTag.StringPropertyEditor,
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
			{ name: 'angle', typeHint: 'number' },
			{ name: '_bounds', label: 'bounds', typeHint: 'rect', data: { readonly: true } },

			// Sprite
			{ name: 'key', typeHint: 'string' },
			{ name: 'frameName', typeHint: 'string' },
			{ name: 'blendMode', typeHint: 'valueList', values: Phaser.blendModes },
			{ name: 'tint', typeHint: 'color' },
			{ name: 'smoothed', typeHint: 'boolean' },
			// TODO waiting for multiple type hint
			// { name: 'hitArea', typeHint: 'rect' },

			// Text
			{ name: 'text', typeHint: 'text', data: { rows: 3 } },
			{ name: 'fill', typeHint: 'cssColor' },
			{ name: 'font', typeHint: 'string' },
			{ name: 'fontSize', typeHint: 'number', data: { min: 0, step: 1 } },
			{ name: 'fontStyle', typeHint: 'valueList', values: ['normal', 'italic', 'oblique'] },
			{ name: 'fontWeight', typeHint: 'valueList', values: ['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900'] },
			{ name: 'fontVariant', typeHint: 'valueList', values: ['normal', 'small-caps'] },
			{ name: 'autoRound', typeHint: 'boolean' },
			{ name: 'resolution', typeHint: 'number', data: { min: 0, step: 1 } },
			{ name: 'align', typeHint: 'valueList', values: ['left', 'center', 'right'] },
			{ name: 'lineSpacing', typeHint: 'number', data: { step: 1 } },
			{ name: 'wordWrap', typeHint: 'boolean' },
			{ name: 'wordWrapWidth', typeHint: 'number', data: { min: 0, step: 1 } },
			{ name: 'useAdvancedWordWrap', typeHint: 'boolean' },
			{ name: 'padding', typeHint: 'point' },
			{ name: 'textBounds', typeHint: 'rect' }, // TODO waiting for null checking on rect editor
			{ name: 'boundsAlignH', typeHint: 'valueList', values: ['left', 'center', 'right'] },
			{ name: 'boundsAlignV', typeHint: 'valueList', values: ['top', 'middle', 'bottom'] },
			{ name: 'shadowBlur', typeHint: 'number', data: { min: 0, step: 0.1 } },
			{ name: 'shadowColor', typeHint: 'string' },
			{ name: 'shadowOffsetX', typeHint: 'number', data: { min: 0, step: 0.1 } },
			{ name: 'shadowOffsetY', typeHint: 'number', data: { min: 0, step: 0.1 } },
			{ name: 'shadowFill', typeHint: 'boolean' },
			{ name: 'shadowStroke', typeHint: 'boolean' },
			{ name: 'stroke', typeHint: 'string' },
			{ name: 'strokeThickness', typeHint: 'number', data: { min: 0, step: 0.1 } },
			{ name: 'characterLimitSize', typeHint: 'number', data: { min: 0, step: 1 } },
			{ name: 'characterLimitSuffix', typeHint: 'string' },
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
			{ title: 'Sprite', properties: ['key', 'frameName', 'blendMode', 'tint', 'smoothed'] },
		]);

		data.addObjectProperties('Phaser.Image', [
			basicProperties,
			{ title: 'Sprite', properties: ['key', 'frameName', 'blendMode', 'tint', 'smoothed'] },
		]);

		data.addObjectProperties('Phaser.Graphics', [
			basicProperties,
			{ title: 'Sprite', properties: ['blendMode', 'tint'] },
		]);

		data.addObjectProperties('Phaser.Text', [
			basicProperties,
			{ title: 'Sprite', properties: ['blendMode', 'tint', 'smoothed'] },
			{
				title: 'Text',
				properties: [
					'text',
					'fill',
					'font',
					'fontSize',
					'fontStyle',
					'fontVariant',
					'fontWeight',
					'autoRound',
					'resolution',
					'---',
					'align',
					'lineSpacing',
					'wordWrap',
					'wordWrapWidth',
					'useAdvancedWordWrap',
					'---',
					'padding',
					'textBounds',
					'boundsAlignH',
					'boundsAlignV',
					'---',
					'characterLimitSize',
					'characterLimitSuffix',
				],
			},
			{
				title: 'Effects',
				properties: [
					'shadowBlur',
					'shadowColor',
					'shadowOffsetX',
					'shadowOffsetY',
					'shadowFill',
					'---',
					'shadowStroke',
					'stroke',
					'strokeThickness',
				],
			},
		]);

		data.addObjectProperties('Phaser.BitmapText', [
			basicProperties,
			{ title: 'Sprite', properties: ['tint'] },
			{ title: 'Bitmap Text', properties: ['text', 'font', 'fontSize', 'align'] },
		]);

		return data;
	}

	private createActions() {
		const actions = new ActionHandler();
		actions.add(
			{
				id: Actions.TOGGLE_ENABLED,
				tooltip: 'Toggle editor',
				icon: 'fa-edit',
				category: 'general',
			},

			{
				id: Actions.TOGGLE_SNAP,
				tooltip: 'Toggle snap',
				icon: 'fa-border-all',
				toggle: true,
				category: 'scene',
			},
			{
				id: Actions.TOGGLE_GIZMOS,
				tooltip: 'Toggle gizmos',
				icon: 'fa-vector-square',
				toggle: true,
				shortcuts: ['ctrl+`', 'ctrl+.'],
				category: 'scene',
			},
			{
				id: Actions.TOGGLE_GUIDES,
				toggle: true,
				tooltip: 'Toggle guides',
				icon: 'fa-compress',
				category: 'scene',
			},
			{
				id: Actions.TOGGLE_HIT_AREA,
				toggle: true,
				tooltip: 'Toggle hit area',
				description: 'Toggle hit area for selected object',
				icon: 'fa-hand-point-up',
				category: 'scene',
			},
			{
				id: Actions.TOGGLE_HIT_AREAS_SNAPSHOT,
				toggle: true,
				tooltip: 'Toggle all hit areas snapshot',
				description: 'Shows a snapshot of all hit areas in the scene',
				icon: 'fa-layer-group',
				category: 'scene',
			},
			{
				id: Actions.TOGGLE_GAME_PAUSED,
				toggle: true,
				tooltip: 'Toggle game paused',
				icon: 'fa-pause',
				category: 'game',
			},
			{
				id: Actions.TOGGLE_PASS_THRU,
				shortcuts: ['ctrl+1'],
				toggle: true,
				tooltip: 'Toggle pass thru',
				icon: 'fa-ghost',
				category: 'game',
				description: 'Toggle pass thru mode (click on the game)',
			},
			{
				id: Actions.TOGGLE_RESPONSIVE,
				toggle: true,
				tooltip: 'Toggle responsive',
				description: 'Toggle responsive mode',
				icon: 'fa-tablet-alt',
				category: 'view',
			},
			{
				id: Actions.TOGGLE_ORIENTATION,
				tooltip: 'Change orientation',
				description: 'Change orientation on responsive mode',
				icon: 'fa-retweet',
				category: 'view',
			},
			{
				id: Actions.TOGGLE_REF_IMAGE,
				toggle: true,
				tooltip: 'Toggle reference image',
				description: 'Toggle reference image (if any)',
				icon: 'fa-image',
				category: 'scene',
			},
			{
				id: Actions.UNDO,
				tooltip: 'Undo',
				icon: 'fa-undo-alt',
				shortcuts: ['ctrl+z'],
				category: 'general',
			},

			{
				id: Actions.PRINT_OBJECT,
				tooltip: 'Print to console',
				description: 'Print the selected element into the console',
				icon: 'fa-terminal',
				shortcuts: ['ctrl+alt+p'],
				category: 'general',
			},

			{
				id: Actions.CLEAR_SELECTION,
				shortcuts: ['Escape'],
				category: 'general',
				description: 'Clear selection',
			},
			{
				id: Actions.MOVE_UP_1,
				shortcuts: ['ArrowUp'],
				stritct: true,
				category: 'scene',
				description: 'Move selected object up by 1px',
			},
			{
				id: Actions.MOVE_DOWN_1,
				shortcuts: ['ArrowDown'],
				stritct: true,
				category: 'scene',
				description: 'Move selected object down by 1px',
			},
			{
				id: Actions.MOVE_LEFT_1,
				shortcuts: ['ArrowLeft'],
				stritct: true,
				category: 'scene',
				description: 'Move selected object left 1px',
			},
			{
				id: Actions.MOVE_RIGHT_1,
				shortcuts: ['ArrowRight'],
				stritct: true,
				category: 'scene',
				description: 'Move selected object right by 1px',
			},
			{
				id: Actions.MOVE_UP_10,
				shortcuts: ['shift+ArrowUp'],
				stritct: true,
				category: 'scene',
				description: 'Move selected object up by 10px',
			},
			{
				id: Actions.MOVE_DOWN_10,
				shortcuts: ['shift+ArrowDown'],
				stritct: true,
				category: 'scene',
				description: 'Move selected object down by 10px',
			},
			{
				id: Actions.MOVE_LEFT_10,
				shortcuts: ['shift+ArrowLeft'],
				stritct: true,
				category: 'scene',
				description: 'Move selected object left by 10px',
			},
			{
				id: Actions.MOVE_RIGHT_10,
				shortcuts: ['shift+ArrowRight'],
				stritct: true,
				category: 'scene',
				description: 'Move selected object right by 10px',
			},

			{
				id: Actions.ZOOM,
				shortcuts: ['ctrl+wheel'],
				category: 'view',
				description: 'Zoom',
			},
			{
				id: Actions.ZOOM_IN,
				tooltip: 'Zoom in',
				icon: 'fa-search-plus',
				shortcuts: ['ctrl+=', 'ctrl++'],
				category: 'view',
			},
			{
				id: Actions.ZOOM_OUT,
				tooltip: 'Zoom out',
				icon: 'fa-search-minus',
				shortcuts: ['ctrl+-'],
				category: 'view',
			},
			{
				id: Actions.ZOOM_RESET,
				tooltip: 'Reset zoom',
				description: 'Reset zoom to default',
				icon: 'fa-expand',
				shortcuts: ['ctrl+0'],
				category: 'view',
			},

			{
				id: Actions.TOGGLE_LEFT_PANEL,
				tooltip: 'Toogle left panel',
				icon: 'fa-angle-double-left',
				shortcuts: ['ctrl+['],
				category: 'view',
			},
			{
				id: Actions.TOGGLE_RIGHT_PANEL,
				tooltip: 'Toogle right panel',
				icon: 'fa-angle-double-right',
				shortcuts: ['ctrl+]'],
				category: 'view',
			},

			{
				id: Actions.HELP,
				tooltip: 'Help',
				icon: 'fa-question',
				category: 'general',
			},

			{
				id: Actions.LOCK_SELECTION,
				tooltip: 'Lock/unlock selection',
				toggle: true,
				icon: 'fa-lock',
				category: 'object-tree',
			},
			{
				id: Actions.SELECT_PARENT,
				tooltip: 'Select parent',
				icon: 'fa-level-up-alt',
				toggle: true,
				shortcuts: ['ctrl+shift+q'],
				category: 'object-tree',
			},
			{
				id: Actions.REFRESH_OBJECT_TREE,
				tooltip: 'Refresh',
				icon: 'fa-sync-alt',
				category: 'object-tree',
			},
			{
				id: Actions.COLLAPSE_OBJECT_TREE,
				tooltip: 'Collapse all',
				icon: 'fa-minus',
				category: 'object-tree',
			}
		);

		return actions;
	}

	public setupInitialActions(root: Container) {
		new ActionsSetup().setup(this.actions, this.data, this.history, this.prefs, root);
	}

	public enable(config: PluginConfig) {
		this.actions.enable();
		this.referenceImageController.enable(config);
		this.data.enable(config.root, config.saveLockedObjectsPath, this.prefs);
	}

	public disable() {
		this.data.selectObject(null, DataOrigin.ACTION);
		this.actions.disable();
	}
}

export const Editor = new EditorClass();
