export interface DraggingHandler {
	startHandling(e: MouseEvent): void;
	handle(e: MouseEvent): void;
	stopHandling(e: MouseEvent): void;
}