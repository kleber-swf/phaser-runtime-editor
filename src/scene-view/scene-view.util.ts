import { HIT_AREA_COLOR } from './scene-colors';

export class SceneViewUtil {
	public static drawHitArea(obj: PIXI.DisplayObject, bounds: PIXI.Rectangle, view: Phaser.Graphics) {
		const area = obj.hitArea ?? bounds;
		view.lineStyle(1, HIT_AREA_COLOR, 1).beginFill(HIT_AREA_COLOR, 0.5);
		if (area instanceof Phaser.Rectangle) {
			view.drawRect(area.x, area.y, area.width, area.height)
		} else if (area instanceof Phaser.Circle) {
			view.drawCircle(bounds.x + area.x, bounds.y + area.y, area.diameter)
		}
		view.endFill();
	}
}