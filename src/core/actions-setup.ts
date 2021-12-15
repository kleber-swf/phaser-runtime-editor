import { DataOrigin, EditorData } from 'data/editor-data';
import { Size } from 'plugin.model';
import { ActionHandler } from './action-handler';
import { Actions } from './actions';
import { History } from './history';
import { Preferences } from './preferences/preferences';

export class ActionsSetup {
	public setup(actions: ActionHandler, data: EditorData, history: History, prefs: Preferences) {
		this.setupDataActions(data, actions, prefs);
		this.setuphistoryActions(history, actions);
		this.setupPreferencesActions(prefs, actions);
	}

	public setuphistoryActions(history: History, actions: ActionHandler) {
		actions.setActionCommand(Actions.UNDO, history.undo.bind(history));
	}

	private setupPreferencesActions(prefs: Preferences, actions: ActionHandler) {
		actions.setActionCommand(
			Actions.TOGGLE_SNAP,
			() => prefs.toggle('snap'),
			() => prefs.get('snap') as boolean
		);

		actions.setActionCommand(
			Actions.TOGGLE_GIZMOS,
			() => prefs.toggle('gizmos'),
			() => prefs.get('gizmos') as boolean
		);

		actions.setActionCommand(
			Actions.TOGGLE_GUIDES,
			() => prefs.toggle('guides'),
			() => prefs.get('guides') as boolean
		);

		actions.setActionCommand(
			Actions.TOGGLE_HIT_AREA,
			() => prefs.toggle('hitArea'),
			() => prefs.get('hitArea') as boolean
		);

		actions.setActionCommand(
			Actions.TOGGLE_RESPONSIVE,
			() => prefs.toggle('responsive'),
			() => prefs.get('responsive') as boolean
		);

		actions.setActionCommand(Actions.TOGGLE_ORIENTATION, () => {
			const size = prefs.get('responsiveSize') as Size;
			prefs.set('responsiveSize', { width: size.height, height: size.width });
		});

		actions.setActionCommand(
			Actions.TOGGLE_HIT_AREAS_SNAPSHOT,
			() => prefs.toggle('hitAreasSnapshot'),
			() => prefs.get('hitAreasSnapshot') as boolean
		);

		actions.setActionCommand(
			Actions.TOGGLE_REF_IMAGE,
			() => prefs.toggle('referenceImageVisible'),
			() => prefs.get('referenceImageVisible') as boolean
		);

		actions.setActionCommand(
			Actions.TOGGLE_LEFT_PANEL,
			() => prefs.toggle('leftPanelVisible'),
			() => prefs.get('leftPanelVisible') as boolean
		);

		actions.setActionCommand(
			Actions.TOGGLE_RIGHT_PANEL,
			() => prefs.toggle('rightPanelVisible'),
			() => prefs.get('rightPanelVisible') as boolean
		);
	}

	public setupDataActions(data: EditorData, actions: ActionHandler, prefs: Preferences) {
		actions.setActionCommand(Actions.CLEAR_SELECTION, () => data.selectObject(null, DataOrigin.ACTION));
		actions.setActionCommand(Actions.PRINT_OBJECT, () => {
			if (data.selectedObject) console.info(data.selectedObject);
		});

		actions.setActionCommand(Actions.SELECT_PARENT, () => {
			if (data.selectedObject) data.selectObject(data.selectedObject.parent, DataOrigin.ACTION);
		});

		actions.setActionCommand(
			Actions.LOCK_SELECTION,
			() => this.toggleLockSelection(data, prefs),
			() => data.selectedObject?.__locked
		);
	}

	private toggleLockSelection(data: EditorData, prefs: Preferences) {
		if (!data.selectedObject) return;
		const obj = data.selectedObject;
		obj.__locked = !obj.__locked;

		const path: number[] = [];
		let o = obj;
		while (o.parent) {
			path.unshift(o.parent.getChildIndex(o));
			o = o.parent;
		}

		const pathId = path.join(',');
		const locked = prefs.get('lockedObjects') as string[];
		const i = locked.indexOf(pathId);

		if (obj.__locked) {
			if (i < 0) locked.push(pathId);
		} else if (i >= 0) locked.splice(i, 1);

		prefs.set('lockedObjects', locked);

		data.onObjectLocked.dispatch(obj);
	}
}
