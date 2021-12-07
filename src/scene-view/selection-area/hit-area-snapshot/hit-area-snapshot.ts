import './hit-area-snapshot.scss';

const COLORS = [
	'254, 164, 67',
	'112, 94, 120',
	'129, 47, 51',
	'62, 181, 149',
	'100, 70, 166',
	'191, 23, 116',
	'77, 116, 140',
	'242, 87, 87',
	'138, 166, 155',
	'217, 164, 145',
];

export class HitAreaSnapshot extends HTMLElement {
	public static readonly tagName = 'phred-hit-area-snapshot';
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;
	private root: Container;

	public init(game: Phaser.Game) {
		const canvas = this.canvas = document.createElement('canvas');
		canvas.width = game.width;
		canvas.height = game.height;
		this.appendChild(canvas);
		this.context = canvas.getContext('2d');
	}

	public enable(root: Container) { this.root = root; }

	public show() {
		this.root.updateTransform();
		this.showHitAreasFor(this.root, this.context, 0);
		this.style.display = 'inline-block';
	}

	public hide() {
		this.style.display = 'none';
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	private showHitAreasFor(container: Container, context: CanvasRenderingContext2D, index: number) {
		if (container.inputEnabled) this.drawHitArea(container, context, index);
		if (container.children?.length) {
			for (let i = 0, n = container.children.length; i < n; i++) {
				this.showHitAreasFor(container.children[i] as PIXI.DisplayObjectContainer, context, ++index);
			}
		}
	}

	private drawHitArea(container: Container, context: CanvasRenderingContext2D, index: number) {
		const b = container.getBounds();
		const hitArea = container.hitArea as any || { x: 0, y: 0, width: b.width, height: b.height };
		b.x += hitArea.x;
		b.y += hitArea.y;

		const color = COLORS[index % COLORS.length];
		context.fillStyle = `rgba(${color}, 0.2)`;
		context.strokeStyle = `rgba(${color}, 0.5)`;

		if (hitArea.radius) {
			context.beginPath();
			context.arc(b.x, b.y, hitArea.radius, 0, Math.PI * 2, true);
			context.fill();
			context.stroke();
		} else {
			b.width = hitArea.width;
			b.height = hitArea.height;
			context.fillRect(b.x, b.y, b.width, b.height);
			context.strokeRect(b.x, b.y, b.width, b.height);
		}
	}
}

customElements.define(HitAreaSnapshot.tagName, HitAreaSnapshot);
