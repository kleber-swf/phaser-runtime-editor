import './game-resize-handle.scss';

export class GameResizeHandle extends HTMLElement {
	public static readonly tagName = 'phred-game-resize-handle';

	private parent: HTMLElement;
	private dragBind: (e: MouseEvent) => void;
	private stopDraggingBind: () => void;
	private dragSideBind: (e: MouseEvent) => void;
	public onStopDrag: (width: number, height: number) => void;

	public init(parent: HTMLElement, side: 'right' | 'bottom' | 'both') {
		this.parent = parent;
		this.classList.add('fas', side);
		this.dragBind = this.drag.bind(this);
		if (side === 'right') this.dragSideBind = this.dragRight.bind(this);
		else if (side === 'bottom') this.dragSideBind = this.dragBottom.bind(this);
		else this.dragSideBind = this.dragBoth.bind(this);
		this.stopDraggingBind = this.stopDragging.bind(this);
		this.addEventListener('mousedown', this.startDragging);
	}

	private startDragging(e: MouseEvent) {
		if (e.button !== 0) return;
		window.addEventListener('mousemove', this.dragBind);
		window.addEventListener('mouseup', this.stopDraggingBind);
	}

	private drag(e: MouseEvent) {
		e.stopImmediatePropagation();
		e.preventDefault();
		this.dragSideBind(e);
	}

	private dragRight(e: MouseEvent) {
		this.parent.style.width = (this.parent.clientWidth + e.movementX * 2) + 'px';
	}

	private dragBottom(e: MouseEvent) {
		this.parent.style.height = (this.parent.clientHeight + e.movementY * 2) + 'px';
	}

	private dragBoth(e: MouseEvent) {
		this.dragRight(e);
		this.dragBottom(e);
	}

	private stopDragging() {
		window.removeEventListener('mousemove', this.dragBind);
		window.removeEventListener('mouseup', this.stopDraggingBind);
		this.onStopDrag(this.parent.clientWidth, this.parent.clientHeight);
	}
}

customElements.define(GameResizeHandle.tagName, GameResizeHandle);
