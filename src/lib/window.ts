import { invoke } from '@tauri-apps/api/core';

/**
 * Set the main window always on top via Rust backend
 */
export async function setAlwaysOnTop(alwaysOnTop: boolean): Promise<void> {
    try {
        await invoke('set_always_on_top', { alwaysOnTop });
        console.log('Always on top set to:', alwaysOnTop);
    } catch (error) {
        console.error('Failed to set always on top:', error);
    }
}

/**
 * Show popup notification window via Rust backend
 * This creates a NEW window that appears over fullscreen apps
 */
export async function showPopupWindow(): Promise<void> {
    try {
        await invoke('show_popup_window');
        console.log('Popup window shown');
    } catch (error) {
        console.error('Failed to show popup window:', error);
    }
}

/**
 * Close popup window via Rust backend
 */
export async function closePopupWindow(): Promise<void> {
    try {
        await invoke('close_popup_window');
        console.log('Popup window closed');
    } catch (error) {
        console.error('Failed to close popup window:', error);
    }
}

/**
 * Request user attention (flash taskbar) via Rust backend
 */
export async function requestAttention(): Promise<void> {
    try {
        await invoke('request_attention');
        console.log('Attention requested');
    } catch (error) {
        console.error('Failed to request attention:', error);
    }
}

/**
 * Play notification sound using Web Audio API
 * Creates a pleasant two-tone chime
 */
export async function playNotificationSound(): Promise<void> {
    try {
        // First try Rust backend (Windows system sound)
        await invoke('play_notification_sound');
    } catch (error) {
        console.log('Rust sound failed, using Web Audio API');
    }

    // Also play Web Audio as backup/additional sound
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Create a pleasant notification chime
        const playTone = (frequency: number, startTime: number, duration: number) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, startTime);

            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        };

        const now = audioContext.currentTime;

        // Two-tone chime: C5 -> E5 (pleasant major third)
        playTone(523.25, now, 0.2);        // C5
        playTone(659.25, now + 0.15, 0.3); // E5

        console.log('Notification sound played');
    } catch (error) {
        console.error('Failed to play notification sound:', error);
    }
}

/**
 * Play a click sound for button feedback
 */
export function playClickSound(): void {
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        // Silently fail for click sounds
    }
}

/**
 * Enable or disable Windows autostart via Rust backend
 */
export async function setAutostart(enabled: boolean): Promise<void> {
    try {
        await invoke('set_autostart', { enabled });
        console.log('Autostart set to:', enabled);
    } catch (error) {
        console.error('Failed to set autostart:', error);
    }
}

/**
 * Check if autostart is enabled
 */
export async function isAutostartEnabled(): Promise<boolean> {
    try {
        return await invoke('is_autostart_enabled') as boolean;
    } catch (error) {
        console.error('Failed to check autostart status:', error);
        return false;
    }
}
