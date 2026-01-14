import { Store } from '@tauri-apps/plugin-store';
import { Settings, DEFAULT_SETTINGS } from '../types/settings';

const STORE_FILENAME = 'settings.json';
const LOCAL_STORAGE_KEY = 'reminder-settings';
let store: Store | null = null;
let isTauriAvailable = true;

async function getStore(): Promise<Store | null> {
    if (!isTauriAvailable) return null;

    if (!store) {
        try {
            store = await Store.load(STORE_FILENAME);
        } catch (error) {
            console.warn('Tauri store not available, using localStorage fallback');
            isTauriAvailable = false;
            return null;
        }
    }
    return store;
}

function getFromLocalStorage(): Settings | null {
    try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

function saveToLocalStorage(settings: Settings): void {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}

export async function loadSettings(): Promise<Settings> {
    try {
        const storeInstance = await getStore();

        if (storeInstance) {
            const saved = await storeInstance.get<Settings>('settings');
            if (saved) {
                return { ...DEFAULT_SETTINGS, ...saved };
            }
            // First run - save defaults
            await saveSettings(DEFAULT_SETTINGS);
            return DEFAULT_SETTINGS;
        }

        // Fallback to localStorage
        const localSettings = getFromLocalStorage();
        if (localSettings) {
            return { ...DEFAULT_SETTINGS, ...localSettings };
        }

        saveToLocalStorage(DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
    } catch (error) {
        console.error('Failed to load settings:', error);
        // Try localStorage as last resort
        const localSettings = getFromLocalStorage();
        return localSettings ? { ...DEFAULT_SETTINGS, ...localSettings } : DEFAULT_SETTINGS;
    }
}

export async function saveSettings(settings: Settings): Promise<void> {
    // Always save to localStorage as backup
    saveToLocalStorage(settings);

    try {
        const storeInstance = await getStore();

        if (storeInstance) {
            await storeInstance.set('settings', settings);
            await storeInstance.save();
        }
    } catch (error) {
        console.error('Failed to save to Tauri store:', error);
        // Already saved to localStorage, so don't throw
    }
}

export async function resetSettings(): Promise<Settings> {
    await saveSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
}
