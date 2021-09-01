export interface PhaserDataType {
	name: string;
	icon: string;
}

class PhaserDataClass {
	private readonly types: { [id: number]: PhaserDataType } = {
		[Phaser.BITMAPDATA]: { name: 'BitmapData', icon: '' },
		[Phaser.BITMAPTEXT]: { name: 'BitmapText', icon: 'fa-font' },
		[Phaser.BUTTON]: { name: 'Button', icon: '' },
		[Phaser.CANVAS_FILTER]: { name: 'CanvasFilter', icon: '' },
		[Phaser.CIRCLE]: { name: 'Circle', icon: '' },
		[Phaser.ELLIPSE]: { name: 'Ellipse', icon: '' },
		[Phaser.EMITTER]: { name: 'Emitter', icon: '' },
		[Phaser.GRAPHICS]: { name: 'Graphics', icon: 'fa-square' },
		[Phaser.GROUP]: { name: 'Group', icon: 'fa-dice-d6' },
		[Phaser.IMAGE]: { name: 'Image', icon: 'fa-image' },
		[Phaser.LINE]: { name: 'Line', icon: '' },
		[Phaser.MATRIX]: { name: 'Matrix', icon: '' },
		[Phaser.POINT]: { name: 'Point', icon: '' },
		[Phaser.POINTER]: { name: 'Pointer', icon: '' },
		[Phaser.POLYGON]: { name: 'Polygon', icon: '' },
		[Phaser.RECTANGLE]: { name: 'Rectangle', icon: '' },
		[Phaser.ROUNDEDRECTANGLE]: { name: 'RoundedRectangle', icon: '' },
		[Phaser.RENDERTEXTURE]: { name: 'RenderTexture', icon: '' },
		[Phaser.RETROFONT]: { name: 'RetroFont', icon: 'fa-font' },
		[Phaser.SPRITE]: { name: 'Sprite', icon: 'fa-image' },
		[Phaser.SPRITEBATCH]: { name: 'SpriteBatch', icon: 'fa-images' },
		[Phaser.TEXT]: { name: 'Text', icon: 'fa-font' },
		[Phaser.TILEMAP]: { name: 'TileMap', icon: '' },
		[Phaser.TILEMAPLAYER]: { name: 'TileMapPlayer', icon: '' },
		[Phaser.TILESPRITE]: { name: 'TileSprite', icon: '' },
		[Phaser.WEBGL_FILTER]: { name: 'WebGLFilter', icon: '' },
		[Phaser.ROPE]: { name: 'Rope', icon: '' },
		[Phaser.CREATURE]: { name: 'Creature', icon: '' },
		[Phaser.VIDEO]: { name: 'Video', icon: '' },
	};

	private readonly defaultType: PhaserDataType = { name: 'default', icon: 'help_outline' };

	public getType(t: number) { return t in this.types ? this.types[t] : this.defaultType; }
}

export const PhaserData = new PhaserDataClass();