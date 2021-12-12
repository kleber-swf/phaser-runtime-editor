import { Editor } from 'core/editor';
import { PreferenceKey } from './preferences.model';

export class PreferencesUtil {
	public static setupPreferences(prefs: PreferenceKey[], changedListener: (key: PreferenceKey, value: any) => void, context: any) {
		prefs.forEach(key => changedListener.call(context, key, Editor.prefs.get(key)));
		Editor.prefs.onChange.add(changedListener, context);
	}
}
