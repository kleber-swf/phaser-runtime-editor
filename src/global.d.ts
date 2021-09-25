declare namespace PIXI {
	interface DisplayObject {
		__instanceId?: number;
		__type?: string;
		__skip?: boolean;
		__isLeaf?: boolean;
		type?: number;
		name?: string;
		anchor?: Point;
		getBounds?(): Rectangle;
		children?: DisplayObject[];
	}
}

declare type Container = PIXI.DisplayObjectContainer | Phaser.Stage;