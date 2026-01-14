# System Patterns: Windows Reminder

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         Tauri Application               │
├─────────────────┬───────────────────────┤
│   Frontend      │      Backend          │
│   (React/TS)    │      (Rust)           │
├─────────────────┼───────────────────────┤
│ • UI Components │ • Tray Management     │
│ • State Store   │ • Window Controller   │
│ • Timer Logic   │ • Autostart Handler   │
│ • Theme System  │ • Settings Store      │
└─────────────────┴───────────────────────┘
```

## Core Modules

### 1. Timer Engine

**Purpose**: Manage countdown timer with sleep/hibernate protection

**Key Pattern**: Timestamp-based calculation

```typescript
interface TimerState {
  status: "idle" | "running" | "paused" | "expired";
  startTimestamp: number | null;
  intervalMs: number;
  remainingMs: number;
}

function calculateRemaining(state: TimerState): number {
  if (!state.startTimestamp) return state.remainingMs;
  const elapsed = Date.now() - state.startTimestamp;
  return Math.max(0, state.intervalMs - elapsed);
}
```

**State Machine**:

```
idle → running → expired → paused | running
          ↓
   (auto mode: auto-reset)
          ↓
   (confirm mode: wait for user)
```

### 2. Settings Store

**Purpose**: Persist user preferences

**Schema**:

```typescript
interface Settings {
  intervalMinutes: number; // default: 60
  mode: "confirm" | "auto"; // default: 'confirm'
  dnd: boolean; // default: false
  alwaysOnTop: boolean; // default: false
  theme: "system" | "light" | "dark"; // default: 'system'
  autostart: boolean; // default: true
}
```

**Storage**: Tauri Store Plugin → `%APPDATA%/com.reminder.app/settings.json`

### 3. Tray Controller

**Purpose**: Manage system tray icon and menu

**Menu Structure**:

```
Status: "Çalışıyor — 12 dk kaldı"
────────────────────
⏸ Pause / ▶ Resume
🔄 Restart
────────────────────
Süre:
  ○ 40 dakika
  ● 60 dakika
  ○ 90 dakika
  ○ 120 dakika
────────────────────
🔕 DND (toggle)
📌 Always on Top (toggle)
────────────────────
⚙ Ayarlar
❌ Çıkış
```

### 4. Window Manager

**Purpose**: Control application windows

**Windows**:

1. **Settings Window**: Opens on demand, single instance
2. **Popup Window**: Frameless, bottom-right position, conditional always-on-top

### 5. Notification Policy

**DND Rules**:

- DND enabled → Suppress popup
- DND disabled → Show full popup
- **Confirm mode**: Popup stays until user interacts
- **Auto mode**: Popup auto-closes after 10 seconds

## State Management

### Frontend State (Zustand)

```typescript
// timerStore.ts
interface TimerStoreState extends TimerState {
  tick: () => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  resetAndStart: () => void;
  setInterval: (minutes: number) => void;
}

// settingsStore.ts
interface SettingsState extends Settings {
  isLoaded: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (partial: Partial<Settings>) => Promise<void>;
}
```

## Critical Design Decisions

### Sleep/Hibernate Handling

**Decision**: Use timestamp-based calculation
**Rationale**: `setInterval` freezes during sleep, timestamps remain accurate

### Timer Reset Behavior

**Decision**: Separate "Tamam" (pause) and "Tamam + YB" (reset) buttons
**Rationale**: User control over workflow continuation

### Tray-First UX

**Decision**: No main window, tray icon is primary interface
**Rationale**: Reminder app should be invisible until needed

### Persistence Strategy

**Decision**: Save settings immediately on change
**Rationale**: Never lose user preferences, even on crash

## Component Relationships

```
Settings Window ──────► Settings Store ──────► Timer Engine
                              │                      │
Tray Controller ◄─────────────┴──────────────────────┤
       │                                              │
       └──────────────────► Window Manager ◄─────────┘
                                   │
                                   ▼
                            Popup Window
```
