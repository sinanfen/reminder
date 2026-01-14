# Active Context: Windows Reminder

## Current Focus

**Phase**: Desktop Application Running
**Status**: Tauri desktop app compiled and launched successfully

## Recent Changes

- Futuristic neon green theme with Inter font
- All emojis replaced with Lucide React icons
- Tauri desktop app compilation complete (2m 09s)
- Window configuration: 420x640, resizable, centered
- Dark/Light mode fully functional
- Settings persistence working

## Completed Work

### Phase 1: Foundation ✓

1. **Tauri Project**: Created with React + TypeScript + Vite
2. **Theme System**: Dark mode support with light/dark/system modes
3. **Settings Persistence**: Tauri store + Zustand integration
4. **Build System**: TailwindCSS 3 configured, builds in ~1.5s

### Phase 2: Core Logic ✓

1. **Timer Engine**:
   - Timestamp-based calculation (sleep-safe)
   - State machine: idle → running → expired → paused
   - Actions: start, pause, reset, resetAndStart, setInterval
   - Tick interval: 1 second

## Next Steps (Immediate)

1. **Step 5**: Tray icon + menu (install plugin, create icons, wire handlers)
2. **Step 6**: Settings window UI (interval, mode, toggles)
3. **Step 7**: Popup window (frameless, positioned, action buttons)
4. **Step 8**: Timer → Popup flow (Confirm vs Auto mode)
5. **Steps 9-17**: DND, always-on-top, autostart, onboarding, testing, release

## Active Decisions

### Timer Expiration Handling

**Confirm Mode**:

- "Tamam" → pause timer
- "Tamam + Yeniden Başlat" → reset and restart

**Auto Mode**:

- Show popup → auto-reset after delay → continue

### Tray Menu Design

- Status line showing remaining time
- Quick actions: pause/resume, restart
- Interval presets: 40/60/90/120 min
- Toggles: DND, always-on-top
- Settings and exit options

## Important Patterns

### Settings Persistence

- Immediate save on every change (no explicit "Save" button)
- Settings window has "Kaydet" for batch changes
- Fallback to defaults if load fails

### Window Management

- Settings: single instance, focus if already open
- Popup: can appear while settings open
- Tray icon: always visible

### Build Strategy

- TypeScript strict mode enabled
- All builds must pass before proceeding
- ~1.5s build time target maintained

## Learnings and Insights

### Tauri Best Practices

- Keep frontend-backend communication minimal
- Use plugins for OS integration (tray, autostart)
- Store settings in AppData, not project directory

### Timer Design

- Timestamps > tick counting (sleep-safe)
- Calculate remaining time on each tick
- Handle PC time changes gracefully

## Project Context Links

- **Requirements**: See `projectbrief.md`
- **Architecture**: See `systemPatterns.md`
- **Tech Stack**: See `techContext.md`
- **Roadmap**: See `progress.md`
