declare namespace PIXI {
	interface DisplayObject {
		__instanceId?: number;
		__type?: string;
		__baseType?: string;
		__skip?: boolean;
		__isLeaf?: boolean;
		type?: number;
		name?: string;
		anchor?: Point;
		inputEnabled?: boolean;
		getBounds?(): Rectangle;
		children?: DisplayObject[];
	}
}

declare type Container = PIXI.DisplayObjectContainer | Phaser.Stage;