export interface PhaserObjectType {
	name: string;
	icon: string;
}

class PhaserDataClass {
	private readonly types: { [id: number]: PhaserObjectType } = {
		[Phaser.BITMAPDATA]: { name: 'Phaser.BitmapData', icon: '' },
		[Phaser.BITMAPTEXT]: { name: 'Phaser.BitmapText', icon: 'fa-font' },
		[Phaser.BUTTON]: { name: 'Phaser.Button', icon: '' },
		[Phaser.CANVAS_FILTER]: { name: 'Phaser.CanvasFilter', icon: '' },
		[Phaser.CIRCLE]: { name: 'Phaser.Circle', icon: '' },
		[Phaser.ELLIPSE]: { name: 'Phaser.Ellipse', icon: '' },
		[Phaser.EMITTER]: { name: 'Phaser.Emitter', icon: '' },
		[Phaser.GRAPHICS]: { name: 'Phaser.Graphics', icon: 'fa-square' },
		[Phaser.GROUP]: { name: 'Phaser.Group', icon: 'fa-dice-d6' },
		[Phaser.IMAGE]: { name: 'Phaser.Image', icon: 'fa-image' },
		[Phaser.LINE]: { name: 'Phaser.Line', icon: '' },
		[Phaser.MATRIX]: { name: 'Phaser.Matrix', icon: '' },
		[Phaser.POINT]: { name: 'Phaser.Point', icon: '' },
		[Phaser.POINTER]: { name: 'Phaser.Pointer', icon: '' },
		[Phaser.POLYGON]: { name: 'Phaser.Polygon', icon: '' },
		[Phaser.RECTANGLE]: { name: 'Phaser.Rectangle', icon: '' },
		[Phaser.ROUNDEDRECTANGLE]: { name: 'Phaser.RoundedRectangle', icon: '' },
		[Phaser.RENDERTEXTURE]: { name: 'Phaser.RenderTexture', icon: '' },
		[Phaser.RETROFONT]: { name: 'Phaser.RetroFont', icon: 'fa-font' },
		[Phaser.SPRITE]: { name: 'Phaser.Sprite', icon: 'fa-image' },
		[Phaser.SPRITEBATCH]: { name: 'Phaser.SpriteBatch', icon: 'fa-images' },
		[Phaser.TEXT]: { name: 'Phaser.Text', icon: 'fa-font' },
		[Phaser.TILEMAP]: { name: 'Phaser.TileMap', icon: '' },
		[Phaser.TILEMAPLAYER]: { name: 'Phaser.TileMapPlayer', icon: '' },
		[Phaser.TILESPRITE]: { name: 'Phaser.TileSprite', icon: '' },
		[Phaser.WEBGL_FILTER]: { name: 'Phaser.WebGLFilter', icon: '' },
		[Phaser.ROPE]: { name: 'Phaser.Rope', icon: '' },
		[Phaser.CREATURE]: { name: 'Phaser.Creature', icon: '' },
		[Phaser.VIDEO]: { name: 'Phaser.Video', icon: '' },
	};

	private readonly defaultType: PhaserObjectType = { name: 'default', icon: 'help_outline' };

	public getType(t: number) { return t in this.types ? this.types[t] : this.defaultType; }
}

export const PhaserData = new PhaserDataClass();