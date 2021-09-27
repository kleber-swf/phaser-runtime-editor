import { ComponentTags } from 'component-tags';
import { ActionHandler, Actions } from 'index';
import './game-container.scss';

const MIN_WIDTH = 100;
const MAX_WIDTH = 10000;

export class GameContainer extends HTMLElement {
	private gameOriginalParentElement: HTMLElement;
	private gameEditorParentElement: HTMLElement;
	private game: Phaser.Game;

	public init() {
		const el = this.gameEditorParentElement = document.createElement('div');
		el.id = 'phred-game-parent';
		this.appendChild(el);
	}

	public setupActions(actions: ActionHandler) {
		actions.setActionCommand(Actions.ZOOM, (e) => this.zoom(-(e as WheelEvent).deltaY));
		actions.setActionCommand(Actions.ZOOM_IN, () => this.zoom(100));
		actions.setActionCommand(Actions.ZOOM_OUT, () => this.zoom(-100));
	}

	public addGame(game: Phaser.Game) {
		this.game = game;
		const el = game.canvas.parentElement;
		this.gameOriginalParentElement = el.parentElement;
		el.classList.add('phred-game');
		this.gameEditorParentElement.appendChild(el);
	}

	public returnGameToItsParent() {
		const el = this.game.canvas.parentElement;
		el.classList.remove('phred-game');
		this.gameOriginalParentElement.appendChild(el);
		this.gameOriginalParentElement = null;
		this.game = null;
	}

	private zoom(amount: number) {
		const el = this.gameEditorParentElement;
		const width = Math.max(Math.min(el.clientWidth + amount, MAX_WIDTH), MIN_WIDTH);
		el.style.width = width + 'px';
		this.game.scale.refresh();
	}
}

customElements.define(ComponentTags.GameContainer, GameContainer);
