# Project Brief: Windows Reminder Application

## Project Overview

A Windows desktop application that reminds users to take breaks at configurable intervals. Runs in system tray, provides notifications, and supports various user preferences.

## Core Requirements

### Essential Features

1. **Automatic Windows Startup** - Application starts automatically when Windows boots
2. **Configurable Timer**
   - Default: 60 minutes
   - Quick presets: 40, 60, 90, 120 minutes
   - Custom duration support
3. **Notification System**
   - Popup window when timer expires
   - Two operational modes:
     - **Confirm Mode**: User must acknowledge (Tamam) or restart (Tamam + Yeniden Başlat)
     - **Auto Mode**: Shows notification, automatically resets and continues
4. **System Tray Integration**
   - Always visible tray icon
   - Right-click menu with quick actions
   - Status display (time remaining)
5. **Do Not Disturb (DND) Mode** - Suppresses notifications when active
6. **Always On Top** - Optional mode for popup window (default: off)
7. **Theme Support** - Light, Dark, and System modes
8. **Settings Persistence** - All preferences saved between sessions

### Timer Behavior Rules

- **"Tamam" button**: Pause timer (notification dismissed)
- **"Tamam + Yeniden Başlat" button**: Reset timer and restart countdown
- **Auto mode**: Show notification, auto-reset, continue running
- **Sleep/Hibernate protection**: Timer calculation based on timestamps, not ticks

## Technical Constraints

- **Platform**: Windows only
- **Stack**: Tauri v2 + React + TypeScript + Vite
- **UI Framework**: TailwindCSS
- **State Management**: Zustand
- **Persistence**: Tauri Store Plugin (JSON)

## Success Criteria

1. Reliable timer operation (accurate even after sleep/wake)
2. Smooth user experience (responsive UI, clear feedback)
3. Professional appearance (polished, modern design)
4. Stable autostart functionality
5. Efficient resource usage (minimal CPU/RAM footprint)

## Out of Scope (v1.0)

- Multi-platform support (macOS, Linux)
- Mobile companion app
- Cloud sync
- Advanced scheduling (calendar integration)
- Multiple simultaneous timers
