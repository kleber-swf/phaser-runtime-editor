import { rootInfo } from "./root.info";

const BORDER_COLOR = 0x5E9FF2;
const BORDER_WIDTH = 2;
const BORDER_ALPHA = 1;

const SHADOW_COLOR = 0x222222;
const SHADOW_ALPHA = 0.2;

const DRAG_THRESHOLD = 10;
const SMALL_MOVE_STEP = 1;
const LARGE_MOVE_STEP = 10;

const EXTRA_HANDLE_WIDTH = 2;
const EXTRA_HANDLE_COLOR = 0xD9D5C5;
const EXTRA_HANDLE_ALPHA = 0.8;

const KEYS = {
	ArrowUp: { call: 'moveThrough', param: { x: 0, y: -1 } },
	ArrowDown: { call: 'moveThrough', param: { x: 0, y: 1 } },
	ArrowLeft: { call: 'moveThrough', param: { x: -1, y: 0 } },
	ArrowRight: { call: 'moveThrough', param: { x: 1, y: 0 } }
};

export class SelectionController extends Phaser.Group {
	/** @param {Phaser.Game} game */
	constructor(game) {
		super(game);
		this.dragHandler = game.add.graphics(0, 0, this);
		this.input = game.input;

		this.pivotHandler = game.add.graphics(0, 0, this)
			.lineStyle(EXTRA_HANDLE_WIDTH, SHADOW_COLOR, SHADOW_ALPHA)
			.moveTo(1, -5).lineTo(1, 7)
			.moveTo(-5, 1).lineTo(7, 1)
			.lineStyle(EXTRA_HANDLE_WIDTH, EXTRA_HANDLE_COLOR, EXTRA_HANDLE_ALPHA)
			.moveTo(0, -6).lineTo(0, 6)
			.moveTo(-6, 0).lineTo(6, 0)

		this.anchorHandler = game.add.graphics(0, 0, this)
			.lineStyle(EXTRA_HANDLE_WIDTH, SHADOW_COLOR, SHADOW_ALPHA)
			.drawCircle(0, 0, 8)
			.lineStyle(EXTRA_HANDLE_WIDTH, EXTRA_HANDLE_COLOR, EXTRA_HANDLE_ALPHA)
			.drawCircle(0, 0, 8);

		game.input.keyboard.addCallbacks(this, this.onKeyDown, this.onKeyUp);

		this.keyDownId = null;

		this.select(null);
	}

	/**
	 * @private 
	 * @param {Phaser.Game} game
	 * TODO move it to a dedicated class Handler
	 */
	createHandler(game, mx, my) {
		const h = game.add.graphics(0, 0, this)
			.beginFill(SHADOW_COLOR, SHADOW_ALPHA)
			.drawRect(-2, -2, 6, 6)
			.endFill()
			.beginFill(BORDER_COLOR, 1)
			.drawRect(-3, -3, 6, 6)
			.endFill();
		h._mx = mx;
		h._my = my;
		return h;
	}

	/** @param {PIXI.DisplayObjectContainer} obj */
	select(obj) {
		this.selectedObject = obj;
		if (!obj) {
			this.visible = false;
			return;
		}
		this.redraw();
		this.visible = true;
		this.objDownPos = { x: obj.x, y: obj.y };
	}

	redraw() {
		const obj = this.selectedObject;
		const b = obj.getBounds();
		this.position.set(b.x, b.y);
		this.dragHandler.clear()
			.lineStyle(BORDER_WIDTH, SHADOW_COLOR, SHADOW_ALPHA)
			.drawRect(1, 1, b.width, b.height)
			.lineStyle(BORDER_WIDTH, BORDER_COLOR, BORDER_ALPHA)
			.beginFill(0, 0)
			.drawRect(0, 0, b.width, b.height)
			.endFill();

		this.pivotHandler.position.set(obj.pivot.x * rootInfo.scale.x, obj.pivot.y * rootInfo.scale.y);
		const hasAnchor = 'anchor' in obj;
		this.anchorHandler.visible = hasAnchor;
		if (hasAnchor)
			this.anchorHandler.position.set(obj.anchor.x * b.width, obj.anchor.y * b.height);
	}

	update() {
		if (!this.visible) return;
		if (this.isDragging) {
			this.dragUpdate();
			return;
		}
		if (this.isDown) {
			this.isDragging = this.input.mousePointer.positionDown.distance(this.input.mousePointer) > DRAG_THRESHOLD;
			return;
		}
	}

	onInputUp() {
		this.isDown = false;
		if (!this.isDragging)
			return false;
		this.stopDrag();
		return true;
	}

	dragUpdate() {
		const { x, y } = this.input.mousePointer;
		this.setPosition(x - this.localMouseDown.x, y - this.localMouseDown.y);
	}

	/**
	 * @private
	 * @param {number} x 
	 * @param {number} y 
	 */
	setPosition(x, y) {
		const obj = this.selectedObject;
		if (!obj) return;
		this.position.set(x, y);
		const parentScale = { x: 1, y: 1 };
		if (obj.parent) {
			const ws = obj.parent.worldScale;
			parentScale.x = ws.x;
			parentScale.y = ws.y;
		}
		// TODO what the f*ck is happening here? Why do I have to divide by the parent's scale?
		obj.position.set(this.objDownPos.x + (this.x - this.downPos.x) / parentScale.x,
			this.objDownPos.y + (this.y - this.downPos.y) / parentScale.y);
	}

	stopDrag() {
		this.isDown = false;
		this.isDragging = false;
	}

	readyForDrag() {
		if (!this.selectedObject) return;
		this.isDown = true;
		const mousePos = this.input.mousePointer;
		this.localMouseDown = { x: mousePos.x - this.x, y: mousePos.y - this.y };

		this.objDownPos = { x: this.selectedObject.x, y: this.selectedObject.y };
		this.downPos = { x: this.x, y: this.y };
	}


	// #region Keyboard Input

	/**
	 * @private
	 * @param {KeyboardEvent} e
	 */
	onKeyDown(e) {
		if (!(e.key in KEYS)) return;
		e.preventDefault();
		this.keyDownId = e.key;
		const action = KEYS[this.keyDownId];
		this[action.call](e, action.param);
	}

	onKeyUp(e) {
		if (this.keyDownId !== e.key)
			return;
		e.preventDefault();
	}

	moveThrough(e, param) {
		const m = e.shiftKey ? LARGE_MOVE_STEP : SMALL_MOVE_STEP;
		this.setPosition(this.x + param.x * m * rootInfo.scale.x, this.y + param.y * m * rootInfo.scale.y);
		console.log('here');
	}

	// #endregion
}