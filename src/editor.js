import { rootInfo } from './root.info';
import { SelectionController } from './selection.controller';

export class Editor extends Phaser.Group {
	/**
	 * @param {Phaser.Game} game 
	 * @param {Phaser.Group} root
	 */
	constructor(game, root) {
		super(game, null, '_RuntimeEditor_Editor_');
		this.root = root;
		this.onObjectSelected = new Phaser.Signal();
		this.visible = false;

		this.inputHandler = this.setupInput(game);
		this.rootBounds = root.getBounds();

		this.selection = this.add(new SelectionController(game));
		this.rootGraphics = game.add.graphics(0, 0, this);
		this.updateArea();
	}

	/**
	 * @param {Phaser.Game} game 
	 */
	setupInput(game) {
		const inputHandler = game.add.graphics(0, 0, this);
		inputHandler.inputEnabled = true;

		inputHandler.events.onInputDown.add(this.onInputDown, this);
		inputHandler.events.onInputUp.add(this.onInputUp, this);

		return inputHandler;
	}

	updateArea() {
		this.inputHandler
			.clear()
			.beginFill(0, 0)
			.lineStyle(2, 0xFF0000, 0.8)
			.drawRect(0, 0, this.game.width, this.game.height)
			.endFill();

		const r = this.rootBounds = this.root.getBounds();
		rootInfo.scale = this.root.worldScale;
		r.x = this.root.x * rootInfo.scale.x;
		r.y = this.root.y * rootInfo.scale.y;

		this.rootGraphics
			.clear()
			.beginFill(0, 0)
			.lineStyle(1, 0xFFFF00, 0.5)
			.drawRect(r.x, r.y, r.width - r.x, r.height - r.y)
			.endFill();
	}

	/**
	 * @param {boolean} value
	 */
	setVisible(value) {
		this.visible = value;
		if (!value) {
			this.game.scale.onSizeChange.remove(this.onSizeChange, this);
			return;
		}
		this.game.scale.onSizeChange.add(this.onSizeChange, this);
		this.updateArea();
	}

	onSizeChange() {
		this.updateArea();
	}

	onInputDown() {
		const pos = this.game.input.mousePointer;
		this.overSelection = this.selection.getBounds().contains(pos.x, pos.y);
		if (this.overSelection || this.findAndSelect(pos))
			this.selection.readyForDrag();
	}

	onInputUp() {
		const pos = this.game.input.mousePointer;
		if (this.overSelection && this.selection.getBounds().contains(pos.x, pos.y)) {
			if (!this.selection.onInputUp())
				this.findAndSelect(pos);
			return;
		}
		if (this.selection.isDown)
			this.selection.stopDrag();
		else
			this.selection.select(null);
	}

	/** 
	 * @param {Phaser.Point} pos
	 * @returns {boolean}
	 */
	findAndSelect(pos) {
		const children = [];
		let index = this.getChildrenUnderPoint(this.root, pos.x, pos.y, children, -1);
		if (children.length < 1) {
			this.select(null);
			return false;
		}
		index = index <= 0 ? children.length - 1 : index - 1;
		this.select(children[index]);
		return true;
	}

	/** 
	 * @private
	 * @param {PIXI.DisplayObjectContainer} parent
	 * @param {number} x
	 * @param {number} y
	 * @param {Array} children
	 * @param {number} index
	 */
	getChildrenUnderPoint(parent, x, y, result, index) {
		const children = parent._$children;
		for (let i = 0; i < children.length; i++) {
			const child = parent.children[i];
			if (!child.visible) continue;
			const b = child.getBounds();
			if (b.contains(x, y)) {
				if (child == this.selectedObject)
					index = result.length;
				result.push(child);
			}
			index = this.getChildrenUnderPoint(child, x, y, result, index);
		}
		return index;
	}

	/** 
	 * @param {PIXI.DisplayObjectContainer} obj
	 * @param {boolean?} ignoreCheck Whether the check for the same object selected should be ignored
	 */
	select(obj, ignoreCheck) {
		if (this.selectedObject == obj) {
			if (ignoreCheck) return;
			if (obj) {
				if (obj.parent == this.root) return;
				obj = obj.parent;
			}
		}
		this.selectedObject = obj;
		this.selection.select(obj);
		this.onObjectSelected.dispatch(obj);
	}

	onEditorPropertyChanged(prop, value) {
		if (!this.selectedObject) return;
		this.selectedObject[prop] = value;
		setTimeout(() => this.selection.redraw(), 20);
	}
}