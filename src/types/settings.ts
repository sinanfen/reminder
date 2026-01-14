export type Theme = 'light' | 'dark' | 'system';
export type NotificationMode = 'confirm' | 'auto';

export interface Settings {
    intervalMinutes: number;
    mode: NotificationMode;
    dnd: boolean;
    alwaysOnTop: boolean;
    theme: Theme;
    autostart: boolean;
    soundEnabled: boolean;  // New: enable/disable notification sound
}

export const DEFAULT_SETTINGS: Settings = {
    intervalMinutes: 60,
    mode: 'confirm',
    dnd: false,
    alwaysOnTop: false,
    theme: 'system',
    autostart: true,
    soundEnabled: true,  // Sound enabled by default
};
