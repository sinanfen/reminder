# Product Context: Windows Reminder

## Problem Statement

Users working at computers for extended periods often lose track of time, leading to:

- Physical strain (eye fatigue, poor posture)
- Mental fatigue and decreased productivity
- Neglecting breaks, hydration, and movement
- Health issues from prolonged sitting

## Solution

A lightweight, non-intrusive reminder application that:

- Runs silently in the background
- Periodically reminds users to take breaks
- Adapts to user preferences (frequency, notification style)
- Stays out of the way until needed

## User Experience Goals

### Simplicity

- One-time setup with sensible defaults
- Minimal interaction required
- Clear, concise notifications
- No learning curve

### Flexibility

- Adjustable reminder intervals
- Multiple notification modes
- Do Not Disturb for focused work sessions
- Quick access to common actions via tray menu

### Reliability

- Always running when needed
- Accurate timing (even after system sleep)
- Persistent settings across restarts
- Stable autostart functionality

### Visual Design

- Modern, clean interface
- Dark/Light theme support
- Professional appearance
- Clear typography and spacing
- Intuitive controls

## User Workflows

### First Launch

1. Application opens to onboarding/setup screen
2. User configures:
   - Timer duration (default: 60 min)
   - Notification mode (Confirm/Auto)
   - Autostart preference (default: enabled)
3. User clicks "Başlat" (Start)
4. Application minimizes to tray and starts timer

### Daily Use (Confirm Mode)

1. Application runs in tray, showing time remaining
2. Timer expires → Popup appears
3. User clicks:
   - **Tamam**: Acknowledges, timer pauses
   - **Tamam + Yeniden Başlat**: Acknowledges and restarts timer

### Daily Use (Auto Mode)

1. Application runs in tray
2. Timer expires → Popup appears briefly
3. Timer automatically resets and continues
4. User can dismiss popup or let it auto-close

### Focused Work Session

1. User right-clicks tray icon
2. Enables "DND" mode
3. Works uninterrupted
4. Disables DND when ready for reminders again

### Quick Adjustments

1. User right-clicks tray icon
2. Selects new duration (40/60/90/120 min)
3. Timer resets with new interval

## Key Differentiators

- **Sleep-aware**: Accurate timing even after hibernate/wake
- **Dual modes**: Flexibility between manual acknowledgment and auto-continuation
- **Tray-first design**: Non-intrusive, always accessible
- **Professional polish**: Not a simple "hobby project" aesthetic
- **Fast and light**: Minimal resource usage
