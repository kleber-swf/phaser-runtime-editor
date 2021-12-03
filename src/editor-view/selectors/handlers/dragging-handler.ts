export interface DraggingHandler {
	startHandling(e: MouseEvent, object: PIXI.DisplayObject): void;
	handle(e: MouseEvent): void;
	stopHandling(e: MouseEvent): void;
}
