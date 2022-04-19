export interface PhaserObjectType {
	type: string;
	name?: string;
	icon: string;
	ignoreChildren?: boolean;
}

export class PhaserMeta {
	private readonly sceneObjects: Record<string, PhaserObjectType> = {
		[Phaser.BITMAPTEXT]: { type: 'Phaser.BitmapText', icon: 'fa-font', ignoreChildren: true },
		[Phaser.BUTTON]: { type: 'Phaser.Button', icon: '' },
		[Phaser.GRAPHICS]: { type: 'Phaser.Graphics', icon: 'fa-square' },
		[Phaser.GROUP]: { type: 'Phaser.Group', icon: 'fa-dice-d6' },
		[Phaser.IMAGE]: { type: 'Phaser.Image', icon: 'fa-image' },
		[Phaser.SPRITE]: { type: 'Phaser.Sprite', icon: 'fa-image' },
		[Phaser.RETROFONT]: { type: 'Phaser.RetroFont', icon: 'fa-font' },
		[Phaser.TEXT]: { type: 'Phaser.Text', icon: 'fa-font' },
		[Phaser.TILESPRITE]: { type: 'Phaser.TileSprite', icon: 'fa-chess-board' },
		[Phaser.EMITTER]: { type: 'Phaser.Emitter', icon: 'fa-snowflake', ignoreChildren: true },
		// [Phaser.SPRITEBATCH]: { type: 'Phaser.SpriteBatch', icon: 'fa-images' },
		// [Phaser.TILEMAP]: { type: 'Phaser.TileMap', icon: '' },
		// [Phaser.TILEMAPLAYER]: { type: 'Phaser.TileMapPlayer', icon: '' },
		// [Phaser.WEBGL_FILTER]: { type: 'Phaser.WebGLFilter', icon: '' },
		// [Phaser.ROPE]: { type: 'Phaser.Rope', icon: '' },
		// [Phaser.CREATURE]: { type: 'Phaser.Creature', icon: '' },
		// [Phaser.VIDEO]: { type: 'Phaser.Video', icon: '' },
	};

	public addSceneObjects(objects: Record<string, PhaserObjectType>) {
		Object.keys(objects).forEach(k => this.sceneObjects[k] = objects[k]);
	}

	private readonly defaultType: PhaserObjectType = { type: 'Unknown', icon: 'fa-question' };

	public getType(obj: PIXI.DisplayObject) {
		const t = obj.type;
		const type = t in this.sceneObjects ? this.sceneObjects[t] : this.defaultType;
		const ctorName = obj.constructor.name;
		const name = ctorName && ctorName.length > 0 ? ctorName : type.type;
		return Object.assign({ name }, type);
	}
}
