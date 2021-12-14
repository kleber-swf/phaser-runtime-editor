declare namespace PIXI {
	interface DisplayObject {
		__instanceId?: number;
		__type?: string;
		__baseType?: string;
		__locked?: boolean;
		__isLeaf?: boolean;
		type?: number;
		name?: string;
		anchor?: Point;
		inputEnabled?: boolean;
		top: number;
		left: number;
		bottom: number;
		right: number;
		width: number;
		height: number;
		children?: DisplayObject[];
		getBounds?(): Rectangle;
		getLocalBounds(): Rectangle;
		readonly globalScale: Point;
	}
}

declare type Container = PIXI.DisplayObjectContainer | Phaser.Stage;

interface DOMTokenList {
	addOrRemove(className: string, add: boolean): void;
}
