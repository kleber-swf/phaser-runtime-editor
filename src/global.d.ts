declare namespace PIXI {
	interface DisplayObject {
		name?: string;
		__skip?: boolean;
		getBounds?(): Rectangle;
		children?: DisplayObject[];
	}
}