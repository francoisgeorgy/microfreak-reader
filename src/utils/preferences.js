import store from "storejs";

export const LOCAL_STORAGE_KEY = "studiocode.microfreak.preferences";
export const DEFAULT_THEME = 'dark';

let preferences = {
    theme: DEFAULT_THEME,
    midi_channel: 1,
    preset: '1',
    input_id: null,      // web midi port ID
    output_id: null      // web midi port ID
};

export function loadPreferences() {
    const s = store.get(LOCAL_STORAGE_KEY);
    if (s) preferences = Object.assign(preferences, preferences, JSON.parse(s));
    return preferences;
}

export function savePreferences(options = {}) {
    loadPreferences();
    Object.assign(preferences, preferences, options);
    store(LOCAL_STORAGE_KEY, JSON.stringify(preferences));
}
