export interface PhaserObjectType {
	name: string;
	icon: string;
}

export class PhaserMeta {
	private readonly sceneObjects: Record<string, PhaserObjectType> = {
		[Phaser.BITMAPTEXT]: { name: 'Phaser.BitmapText', icon: 'fa-font' },
		[Phaser.BUTTON]: { name: 'Phaser.Button', icon: '' },
		[Phaser.GRAPHICS]: { name: 'Phaser.Graphics', icon: 'fa-square' },
		[Phaser.GROUP]: { name: 'Phaser.Group', icon: 'fa-dice-d6' },
		[Phaser.IMAGE]: { name: 'Phaser.Image', icon: 'fa-image' },
		[Phaser.RETROFONT]: { name: 'Phaser.RetroFont', icon: 'fa-font' },
		[Phaser.SPRITE]: { name: 'Phaser.Sprite', icon: 'fa-image' },
		[Phaser.TEXT]: { name: 'Phaser.Text', icon: 'fa-font' },
		// [Phaser.EMITTER]: { name: 'Phaser.Emitter', icon: '' },
		// [Phaser.SPRITEBATCH]: { name: 'Phaser.SpriteBatch', icon: 'fa-images' },
		// [Phaser.TILEMAP]: { name: 'Phaser.TileMap', icon: '' },
		// [Phaser.TILEMAPLAYER]: { name: 'Phaser.TileMapPlayer', icon: '' },
		// [Phaser.TILESPRITE]: { name: 'Phaser.TileSprite', icon: '' },
		// [Phaser.WEBGL_FILTER]: { name: 'Phaser.WebGLFilter', icon: '' },
		// [Phaser.ROPE]: { name: 'Phaser.Rope', icon: '' },
		// [Phaser.CREATURE]: { name: 'Phaser.Creature', icon: '' },
		// [Phaser.VIDEO]: { name: 'Phaser.Video', icon: '' },
	};

	public addSceneObjects(objects: Record<string, PhaserObjectType>) {
		Object.keys(objects).forEach(k => this.sceneObjects[k] = objects[k]);
	}

	private readonly defaultType: PhaserObjectType = { name: 'Unknown', icon: 'fa-question' };

	public getType(obj: PIXI.DisplayObject) {
		const t = obj.type;
		const type = t in this.sceneObjects ? this.sceneObjects[t] : this.defaultType;
		const ctorName = obj.constructor.name;
		const name = ctorName && ctorName.length > 0 ? ctorName : type.name;
		return Object.assign({}, type, { name });
	}
}
