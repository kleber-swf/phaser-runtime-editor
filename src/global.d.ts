declare namespace PIXI {
	interface DisplayObject {
		__skip?: boolean;
		name?: string;
		anchor?: Point;
		getBounds?(): Rectangle;
		children?: DisplayObject[];
	}
}