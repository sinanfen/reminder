import { create } from 'zustand';
import { TimerState, createInitialTimerState, calculateRemaining, isExpired } from '../lib/timer';
import { useSettingsStore } from './settingsStore';

interface TimerStoreState extends TimerState {
    tick: () => void;
    start: () => void;
    pause: () => void;
    reset: () => void;
    resetAndStart: () => void;
    setInterval: (minutes: number) => void;
    updateRemaining: () => void;
}

export const useTimerStore = create<TimerStoreState>()((set, get) => ({
    ...createInitialTimerState(),

    tick: () => {
        const state = get();

        if (state.status !== 'running') {
            return;
        }

        const remaining = calculateRemaining(state);
        set({ remainingMs: remaining });

        // Check if expired
        if (isExpired(state)) {
            set({ status: 'expired', remainingMs: 0 });
        }
    },

    start: () => {
        const state = get();
        const settings = useSettingsStore.getState();

        if (state.status === 'idle' || state.status === 'paused') {
            const intervalMs = settings.intervalMinutes * 60 * 1000;
            set({
                status: 'running',
                startTimestamp: Date.now(),
                intervalMs,
                remainingMs: intervalMs,
            });
        }
    },

    pause: () => {
        const state = get();

        if (state.status === 'running') {
            const remaining = calculateRemaining(state);
            set({
                status: 'paused',
                startTimestamp: null,
                remainingMs: remaining,
            });
        }
    },

    reset: () => {
        const settings = useSettingsStore.getState();
        const intervalMs = settings.intervalMinutes * 60 * 1000;

        set({
            status: 'idle',
            startTimestamp: null,
            intervalMs,
            remainingMs: intervalMs,
        });
    },

    resetAndStart: () => {
        const { reset, start } = get();
        reset();
        setTimeout(start, 0);
    },

    setInterval: (minutes: number) => {
        const intervalMs = minutes * 60 * 1000;
        const state = get();

        // If running, restart with new interval
        if (state.status === 'running') {
            set({
                intervalMs,
                startTimestamp: Date.now(),
                remainingMs: intervalMs,
            });
        } else {
            // Just update the interval
            set({
                intervalMs,
                remainingMs: intervalMs,
            });
        }
    },

    updateRemaining: () => {
        const state = get();
        if (state.status === 'running') {
            const remaining = calculateRemaining(state);
            set({ remainingMs: remaining });
        }
    },
}));

// Start tick interval (1 second)
if (typeof window !== 'undefined') {
    setInterval(() => {
        useTimerStore.getState().tick();
    }, 1000);
}
