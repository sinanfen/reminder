# Technical Context: Windows Reminder

## Technology Stack

### Frontend

- **React 19.1**: UI library
- **TypeScript 5.8**: Type-safe JavaScript
- **Vite 7.3**: Build tool and dev server
- **TailwindCSS 3**: Utility-first CSS framework
- **Zustand 4**: Lightweight state management
- **@tauri-apps/api 2**: Tauri frontend bindings
- **@tauri-apps/plugin-store 2**: Settings persistence

### Backend

- **Tauri 2**: Desktop application framework
- **Rust (cargo 1.92)**: Systems programming language
- **tauri-plugin-store 2**: Settings storage
- **tauri-plugin-opener 2**: Open URLs
- **serde 1**: Serialization framework
- **serde_json 1**: JSON handling

## Development Environment

### Required Tools

1. **Node.js**: v20+ (currently v20.19.6)
2. **Rust**: cargo 1.92.0
3. **npm**: Package manager

### Setup Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Build Tauri app (requires Rust compilation)
npm run tauri build
```

## Project Structure

```
reminder/
├── src/                          # Frontend (React)
│   ├── components/               # UI components (to be created)
│   ├── contexts/                 # ✓ ThemeContext
│   ├── stores/                   # ✓ settingsStore, timerStore
│   ├── lib/                      # ✓ timer.ts, persistence.ts
│   ├── types/                    # ✓ settings.ts
│   ├── App.tsx
│   ├── main.tsx                  # ✓ ThemeProvider wrapper
│   └── index.css                 # ✓ Tailwind directives
├── src-tauri/                    # Backend (Rust)
│   ├── src/
│   │   └── lib.rs                # ✓ Store plugin initialized
│   ├── Cargo.toml                # ✓ Dependencies configured
│   ├── tauri.conf.json           # Tauri configuration
│   └── icons/                    # App icons (to be created)
├── memory-bank/                  # ✓ Project documentation
├── package.json                  # ✓ Fixed name to "reminder"
├── tailwind.config.js            # ✓ Dark mode + theme
├── postcss.config.js             # ✓ TailwindCSS processing
└── .gitignore                    # ✓ Enhanced with Tauri entries
```

## Build Performance

- **Frontend build**: ~1.5s
- **Bundle size**: ~195KB (~61KB gzipped)
- **Zero vulnerabilities**: All dependencies clean

## Configuration Files

### `tailwind.config.js`

- Dark mode: `class` strategy
- Custom colors, typography (Inter font)
- Responsive breakpoints

### `package.json`

```json
{
  "name": "reminder",
  "version": "0.1.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "tauri": "tauri"
  }
}
```

### `src-tauri/Cargo.toml`

```toml
[dependencies]
tauri = { version = "2", features = [] }
tauri-plugin-opener = "2"
tauri-plugin-store = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

## Known Constraints

- **Windows-only**: Tray icons require .ico format
- **Autostart**: Uses Windows Registry or Task Scheduler
- **Web-based UI**: Trade-off between flexibility and native feel
