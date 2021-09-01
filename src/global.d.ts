declare namespace PIXI {
	interface DisplayObject {
		__instanceId?: number;
		__skip?: boolean;
		type?: number;
		name?: string;
		anchor?: Point;
		getBounds?(): Rectangle;
		children?: DisplayObject[];
	}
}