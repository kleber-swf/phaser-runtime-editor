declare namespace PIXI {
	interface DisplayObject {
		__skip?: boolean;
		type?: number;
		name?: string;
		anchor?: Point;
		getBounds?(): Rectangle;
		children?: DisplayObject[];
	}
}