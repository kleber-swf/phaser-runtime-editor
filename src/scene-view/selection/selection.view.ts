import { Editor } from 'core/editor';
import { PreferenceKey } from 'core/preferences';
import { DataOrigin } from 'data/editor-data';
import { SceneViewUtil } from 'scene-view/scene-view.util';
import { PointUtil } from 'util/math.util';
import { ANCHOR_COLOR, ANCHOR_STROKE, BORDER_COLOR, BORDER_STROKE, PIVOT_COLOR, PIVOT_STROKE } from '../scene-colors';
import { OldScaleHandler } from './scale/scale.handler';

export class SelectionView extends Phaser.Group {
	private _selectedObject: PIXI.DisplayObject = null;
	private _showGuides = false;
	private _showHitArea = false;

	public get hasObject() { return !!this._selectedObject; }

	private readonly view: Phaser.Graphics;
	private readonly scaleHandler: OldScaleHandler;

	constructor(game: Phaser.Game) {
		super(game);
		this.name = '__selection';
		this.__skip = true;

		this.view = new Phaser.Graphics(game);
		this.addChild(this.view);

		this.scaleHandler = new OldScaleHandler(game);
		this.addChild(this.scaleHandler);

		const prefs = Editor.prefs;
		prefs.onPreferenceChanged.add(this.onPreferencesChanged, this);
		this.onPreferencesChanged('gizmos', prefs.gizmos);
		this.onPreferencesChanged('snap', prefs.snap);
		this.onPreferencesChanged('guides', prefs.guides);
		this.onPreferencesChanged('hitArea', prefs.hitArea);

		this.select(null);
	}

	private onPreferencesChanged(key: PreferenceKey, value: any) {
		switch (key) {
			case 'gizmos':
				this.alpha = value ? 1 : 0;
				return;
			case 'snap':
				this.moveFn = value ? this.snapMove : this.freeMove;
				if (this._selectedObject) this.move(0, 0);
				return;
			case 'guides':
				this._showGuides = value === true;
				if (this._selectedObject) this.move(0, 0);
				return;
			case 'hitArea':
				this._showHitArea = value === true;
				if (this._selectedObject) this.move(0, 0);
		}
	}

	public select(obj: PIXI.DisplayObject) {
		this._selectedObject = obj;
		this.view.clear();
		this.scaleHandler.selectedObject = obj;
		if (this.visible = !!obj) this.redraw();
	}

	public redraw() {
		this.view.clear();
		if (!this._selectedObject) return;
		const bounds = this._selectedObject.getBounds();
		if (this._showGuides) this.drawGuides(bounds);
		if (this._showHitArea) this.drawHitArea(bounds);
		this.drawBorder(bounds);
		this.drawPivot(this.scaleHandler.scaling
			? this.scaleHandler.scaler.originalPivot
			: this._selectedObject.pivot);
		this.drawAnchor(this._selectedObject.anchor, bounds);
		this.scaleHandler.redraw(bounds);
		this.position.set(bounds.x, bounds.y);
		this.rotation = this._selectedObject.rotation;
	}

	private drawGuides(bounds: PIXI.Rectangle) {
		const x = this.game.width * 2;
		const y = this.game.height * 2;
		this.view
			.lineStyle(1, 0xFFFFFF, 0.8)
			.moveTo(-x, 0)
			.lineTo(x, 0)

			.moveTo(-x, bounds.height)
			.lineTo(x, bounds.height)

			.moveTo(0, -y)
			.lineTo(0, y)

			.moveTo(bounds.width, -y)
			.lineTo(bounds.width, y);
	}

	private drawBorder(bounds: PIXI.Rectangle) {
		this.view
			.lineStyle(4, BORDER_STROKE, 1)
			.drawRect(0, 0, bounds.width, bounds.height)
			.lineStyle(2, BORDER_COLOR, 1)
			.beginFill(0, 0)
			.drawRect(0, 0, bounds.width, bounds.height)
			.endFill();
	}

	private drawPivot(pivot: PIXI.Point) {
		this.view
			.lineStyle(3, PIVOT_STROKE, 1)
			.moveTo(pivot.x - 10, pivot.y)
			.lineTo(pivot.x + 10, pivot.y)
			.moveTo(pivot.x, pivot.y - 10)
			.lineTo(pivot.x, pivot.y + 10)

			.lineStyle(2, PIVOT_COLOR, 1)
			.moveTo(pivot.x - 9, pivot.y)
			.lineTo(pivot.x + 9, pivot.y)
			.moveTo(pivot.x, pivot.y - 9)
			.lineTo(pivot.x, pivot.y + 9);
	}

	private drawAnchor(anchor: PIXI.Point, bounds: PIXI.Rectangle) {
		if (!anchor) return;
		this.view
			.lineStyle(3, ANCHOR_STROKE, 1)
			.drawCircle(bounds.width * anchor.x, bounds.height * anchor.y, 10)
			.lineStyle(2, ANCHOR_COLOR, 1)
			.drawCircle(bounds.width * anchor.x, bounds.height * anchor.y, 10);
	}

	private drawHitArea(bounds: PIXI.Rectangle) {
		if (!this._selectedObject.inputEnabled) return;
		const b = new PIXI.Rectangle();
		b.width = bounds.width;
		b.height = bounds.height;
		SceneViewUtil.drawHitArea(this._selectedObject, b, this.view);
	}

	public move(deltaX: number, deltaY: number) {
		const pos = this._selectedObject.position;
		const scale = this._selectedObject.parent?.worldScale ?? PointUtil.one;
		this.moveFn(pos, scale, deltaX, deltaY);
		this.redraw();
		Editor.data.propertyChanged('position', pos, DataOrigin.SCENE);
		Editor.data.propertyChanged('_bounds', (this._selectedObject as any)._bounds, DataOrigin.SCENE);
	}

	private moveFn: (pos: PIXI.Point, scale: PIXI.Point, deltaX: number, deltaY: number) => void;

	private freeMove(pos: PIXI.Point, scale: PIXI.Point, deltaX: number, deltaY: number) {
		this._selectedObject.position.set(
			pos.x + deltaX / scale.x,
			pos.y + deltaY / scale.y
		);
	}

	private snapMove(pos: PIXI.Point, scale: PIXI.Point, deltaX: number, deltaY: number) {
		this._selectedObject.position.set(
			Math.round(pos.x + deltaX / scale.x),
			Math.round(pos.y + deltaY / scale.y)
		);
	}

	public update() {
		super.update();
		if (this.scaleHandler.handle()) this.redraw();
	}
}
