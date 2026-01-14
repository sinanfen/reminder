import { useEffect, useState } from "react";
import { useTimerStore } from "./stores/timerStore";
import { useSettingsStore } from "./stores/settingsStore";
import { SettingsWindow } from "./components/SettingsWindow";
import { PopupView } from "./components/PopupView.tsx";
import { setAlwaysOnTop, showPopupWindow, playNotificationSound, requestAttention } from "./lib/window";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Settings as SettingsIcon,
  Timer,
  Zap
} from "lucide-react";

function App() {
  const timer = useTimerStore();
  const settings = useSettingsStore();
  const [showSettings, setShowSettings] = useState(false);
  const [isFirstRun, setIsFirstRun] = useState(true);

  // Check if this is the popup window (opened by Rust)
  const isPopupWindow = window.location.search.includes('popup=true');

  // Load settings on mount
  useEffect(() => {
    settings.loadSettings().then(() => {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (hasSeenOnboarding) {
        setIsFirstRun(false);
      }
    });
  }, []);

  // Apply always-on-top setting when it changes (main window only)
  useEffect(() => {
    if (settings.isLoaded && !isPopupWindow) {
      setAlwaysOnTop(settings.alwaysOnTop);
    }
  }, [settings.alwaysOnTop, settings.isLoaded, isPopupWindow]);

  // Watch for timer expiration - open popup window via Rust backend
  useEffect(() => {
    if (timer.status === 'expired' && !settings.dnd && !isPopupWindow) {
      // Play notification sound if enabled
      if (settings.soundEnabled) {
        playNotificationSound();
      }

      // Request attention (flash taskbar)
      requestAttention();

      // Show popup window via Rust (new window that appears over fullscreen)
      showPopupWindow();
    }
  }, [timer.status]); // Only react to timer status changes

  const handleStartOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setIsFirstRun(false);
    timer.start();
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // If this is a popup window (opened by Rust), render PopupView only
  if (isPopupWindow) {
    return <PopupView />;
  }

  if (showSettings) {
    return <SettingsWindow onBack={() => setShowSettings(false)} />;
  }

  // Onboarding Screen
  if (isFirstRun) {
    return (
      <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-dark dark:shadow-neon p-8 max-w-md w-full space-y-6 border border-dark-200 dark:border-dark-700">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-neon-500/10 dark:bg-neon-400/20 rounded-2xl mb-4">
              <Timer className="w-10 h-10 text-neon-500 dark:text-neon-400" />
            </div>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Reminder</h1>
            <p className="text-dark-500 dark:text-dark-400 mt-2">
              Mola hatırlatıcınız hazır
            </p>
          </div>

          {/* Summary Card */}
          <div className="space-y-3 bg-dark-50 dark:bg-dark-800 rounded-xl p-5 border border-dark-200 dark:border-dark-700">
            <div className="flex justify-between items-center">
              <span className="text-dark-600 dark:text-dark-400 text-sm">Hatırlatma Süresi</span>
              <span className="font-semibold text-neon-600 dark:text-neon-400">{settings.intervalMinutes} dk</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-dark-600 dark:text-dark-400 text-sm">Bildirim Modu</span>
              <span className="font-semibold text-neon-600 dark:text-neon-400">
                {settings.mode === 'confirm' ? 'Manuel' : 'Otomatik'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-dark-600 dark:text-dark-400 text-sm">Otomatik Başlat</span>
              <span className="font-semibold text-neon-600 dark:text-neon-400">
                {settings.autostart ? 'Aktif' : 'Pasif'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleStartOnboarding}
              className="w-full flex items-center justify-center gap-2 bg-neon-500 hover:bg-neon-600 text-white font-semibold py-3.5 rounded-xl transition-all shadow-neon hover:shadow-neon-lg"
            >
              <Zap className="w-5 h-5" />
              Başlat
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center justify-center gap-2 bg-dark-100 hover:bg-dark-200 dark:bg-dark-800 dark:hover:bg-dark-700 text-dark-700 dark:text-dark-300 font-medium py-3 rounded-xl transition-colors border border-dark-200 dark:border-dark-600"
            >
              <SettingsIcon className="w-4 h-4" />
              Ayarları Düzenle
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Timer Screen
  return (
    <>
      <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-dark-200 dark:border-dark-800">
          <div className="flex items-center gap-2">
            <Timer className="w-6 h-6 text-neon-500 dark:text-neon-400" />
            <span className="font-semibold text-dark-900 dark:text-white">Reminder</span>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
          >
            <SettingsIcon className="w-5 h-5 text-dark-600 dark:text-dark-400" />
          </button>
        </header>

        {/* Timer Display */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-8 w-full max-w-md">
            {/* Timer Circle */}
            <div className={`relative mx-auto w-64 h-64 rounded-full flex items-center justify-center
              ${timer.status === 'running' ? 'bg-neon-500/10 dark:bg-neon-400/20 animate-pulse-slow' : 'bg-dark-100 dark:bg-dark-800'}
              border-4 ${timer.status === 'running' ? 'border-neon-500 dark:border-neon-400 shadow-neon' : 'border-dark-300 dark:border-dark-600'}
              transition-all duration-500`}>
              <div className="text-center">
                <Clock className={`w-8 h-8 mx-auto mb-2 ${timer.status === 'running' ? 'text-neon-500 dark:text-neon-400' : 'text-dark-400'}`} />
                <div className={`text-5xl font-bold font-mono tracking-tight
                  ${timer.status === 'running' ? 'text-neon-600 dark:text-neon-400' : 'text-dark-800 dark:text-dark-200'}`}>
                  {formatTime(timer.remainingMs)}
                </div>
                <div className={`text-sm mt-2 font-medium
                  ${timer.status === 'running' ? 'text-neon-600 dark:text-neon-400' : 'text-dark-500'}`}>
                  {timer.status === 'idle' && 'Hazır'}
                  {timer.status === 'running' && 'Çalışıyor'}
                  {timer.status === 'paused' && 'Duraklatıldı'}
                  {timer.status === 'expired' && 'Süre Doldu'}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 justify-center flex-wrap">
              {(timer.status === 'idle' || timer.status === 'paused' || timer.status === 'expired') && (
                <button
                  onClick={() => timer.status === 'expired' ? timer.resetAndStart() : timer.start()}
                  className="flex items-center gap-2 bg-neon-500 hover:bg-neon-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-neon hover:shadow-neon-lg"
                >
                  <Play className="w-5 h-5" />
                  Başlat
                </button>
              )}

              {timer.status === 'running' && (
                <button
                  onClick={() => timer.pause()}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  <Pause className="w-5 h-5" />
                  Duraklat
                </button>
              )}

              <button
                onClick={() => timer.reset()}
                className="flex items-center gap-2 bg-dark-200 hover:bg-dark-300 dark:bg-dark-700 dark:hover:bg-dark-600 text-dark-700 dark:text-dark-300 font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Sıfırla
              </button>
            </div>

            {/* Status Info */}
            <div className="flex items-center justify-center gap-4 text-sm text-dark-500 dark:text-dark-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {settings.intervalMinutes} dk
              </span>
              <span className="text-dark-300 dark:text-dark-600">|</span>
              <span>{settings.mode === 'confirm' ? 'Manuel Onay' : 'Otomatik'}</span>
              {settings.dnd && (
                <>
                  <span className="text-dark-300 dark:text-dark-600">|</span>
                  <span className="text-amber-500 dark:text-amber-400 font-medium">DND Aktif</span>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
