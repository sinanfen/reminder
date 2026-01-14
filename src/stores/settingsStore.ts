import { create } from 'zustand';
import { Settings, DEFAULT_SETTINGS } from '../types/settings';
import { loadSettings, saveSettings } from '../lib/persistence';

interface SettingsState extends Settings {
    isLoaded: boolean;
    loadSettings: () => Promise<void>;
    updateSettings: (partial: Partial<Settings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
    ...DEFAULT_SETTINGS,
    isLoaded: false,

    loadSettings: async () => {
        try {
            const settings = await loadSettings();
            set({ ...settings, isLoaded: true });
        } catch (error) {
            console.error('Failed to load settings:', error);
            set({ isLoaded: true });
        }
    },

    updateSettings: async (partial: Partial<Settings>) => {
        const current = get();
        const updated = {
            intervalMinutes: partial.intervalMinutes ?? current.intervalMinutes,
            mode: partial.mode ?? current.mode,
            dnd: partial.dnd ?? current.dnd,
            alwaysOnTop: partial.alwaysOnTop ?? current.alwaysOnTop,
            theme: partial.theme ?? current.theme,
            autostart: partial.autostart ?? current.autostart,
            soundEnabled: partial.soundEnabled ?? current.soundEnabled,
        };

        // Update UI immediately (optimistic update)
        set(updated);

        // Then persist in background
        try {
            await saveSettings(updated);
        } catch (error) {
            console.error('Failed to save settings:', error);
            // Don't revert - localStorage fallback should have worked
        }
    },
}));
