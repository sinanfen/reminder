export type TimerStatus = 'idle' | 'running' | 'paused' | 'expired';

export interface TimerState {
    status: TimerStatus;
    startTimestamp: number | null;
    intervalMs: number;
    remainingMs: number;
}

export const MINUTE_MS = 60 * 1000;

export function createInitialTimerState(intervalMinutes: number = 60): TimerState {
    return {
        status: 'idle',
        startTimestamp: null,
        intervalMs: intervalMinutes * MINUTE_MS,
        remainingMs: intervalMinutes * MINUTE_MS,
    };
}

export function calculateRemaining(state: TimerState): number {
    if (!state.startTimestamp || state.status !== 'running') {
        return state.remainingMs;
    }

    const elapsed = Date.now() - state.startTimestamp;
    const remaining = Math.max(0, state.intervalMs - elapsed);

    return remaining;
}

export function isExpired(state: TimerState): boolean {
    return calculateRemaining(state) === 0 && state.status === 'running';
}
