const padding = { x: 8, y: 4 };
const headerHeight = 20;
const labelWidth = 50;
const labelHeight = 14;
const indentWidth = 12;

const labelStyle = { font: '14px "Source Code Pro",Consolas,"Courier New",monospaced', fill: '#AAAAAA' };
const valueStyle = { font: '14px "Source Code Pro",Consolas,"Courier New",monospaced', fill: '#CCCCCC', fontWeight: 'bold' };

export class Panel extends Phaser.Group {
	constructor(game, name, title) {
		super(game, null, name);
		this._width = 160;
		this._height = 140;
		this.widget = null;
		this.createWidget(game, title);
		this.redraw();
		this.scale = this.game.scale.scaleFactor;
	}

	createWidget(game, title) {
		this.widget = new Phaser.Graphics(game, 0, 0);
		this.title = new Phaser.Text(game, 3, 2, title ? title.toUpperCase() : '', Object.assign({}, valueStyle, { fontWeight: 'bold', fill: '#CCCCCC' }));

		this.addChild(this.widget);
		this.addChild(this.title);
	}

	redraw() {
		this.widget
			.clear()
			.beginFill(0x333333, 1)
			.drawRect(0, 0, this._width, headerHeight)
			.endFill()
			.beginFill(0x444444, 1)
			.drawRect(0, headerHeight, this._width, this._height - headerHeight)
	}
}


export class PropertiesPanel extends Panel {
	/**
	 * @param {Phaser.Game} game 
	 * @param {title} string
	 */
	constructor(game, title) {
		super(game, '_RuntimeEditor_PropertiesPanel_', title);
		this.obj = null;
		this._nameLabel = null;
		this._typeLabel = null;
		this._xLabel = null;
		this._yLabel = null;
		this.createContent(game);
	}

	/**
	 * @param {Phaser.Game} game
	 */
	createContent(game) {
		let x = padding.x;
		let y = headerHeight + padding.y;

		this.add(new Phaser.Text(game, x, y, 'Name', labelStyle));
		this._nameLabel = new Phaser.Text(game, x + labelWidth, y, '', valueStyle);
		this.add(this._nameLabel);

		x = padding.x;
		y += labelHeight * 1.8;
		this.add(new Phaser.Text(game, x, y, 'Type', labelStyle));
		this._typeLabel = new Phaser.Text(game, x + labelWidth, y, '', valueStyle);
		this.add(this._typeLabel);

		x = padding.x;
		y += labelHeight * 1.8;
		this.add(new Phaser.Text(game, x, y, 'Position', labelStyle));

		x = padding.x + indentWidth;
		y += labelHeight;
		this.add(new Phaser.Text(game, x, y, 'x', labelStyle));
		this._xLabel = new Phaser.Text(game, x + labelWidth, y, '', valueStyle);
		this.add(this._xLabel);

		x = padding.x + indentWidth;
		y += labelHeight;
		this.add(new Phaser.Text(game, x, y, 'y', labelStyle));
		this._yLabel = new Phaser.Text(game, x + labelWidth, y, '', valueStyle);
		this.add(this._yLabel);
	}

	/**
	 * @param {PIXI.DisplayObject} obj 
	 */
	onObjectSelected(obj) {
		this.obj = obj;
		this.visible = !!obj;
		if (!this.visible) return;
		this._nameLabel.text = obj.name ? obj.name : '';
		this._typeLabel.text = obj.constructor.name;
	}

	update() {
		if (!this.obj) return;
		const obj = this.obj;
		this._xLabel.text = obj.x.toFixed(1);
		this._yLabel.text = obj.y.toFixed(1);
	}
}
