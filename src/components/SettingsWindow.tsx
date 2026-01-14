import { useTimerStore } from '../stores/timerStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useTheme } from '../contexts/ThemeContext';
import { setAutostart, isAutostartEnabled } from '../lib/window';
import {
    ArrowLeft,
    Clock,
    Moon,
    Sun,
    Monitor,
    Bell,
    BellOff,
    Pin,
    Zap,
    Timer,
    Check,
    Volume2,
    VolumeX
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SettingsWindowProps {
    onBack: () => void;
}

export function SettingsWindow({ onBack }: SettingsWindowProps) {
    const { theme, setTheme } = useTheme();
    const settings = useSettingsStore();
    const { setInterval } = useTimerStore();
    const [saved, setSaved] = useState(false);

    const intervals = [40, 60, 90, 120];

    const handleIntervalChange = async (minutes: number) => {
        await settings.updateSettings({ intervalMinutes: minutes });
        setInterval(minutes);
    };

    // Sync autostart setting with Windows registry on mount
    useEffect(() => {
        const syncAutostart = async () => {
            const isEnabled = await isAutostartEnabled();
            if (isEnabled !== settings.autostart) {
                await settings.updateSettings({ autostart: isEnabled });
            }
        };
        if (settings.isLoaded) {
            syncAutostart();
        }
    }, [settings.isLoaded]);

    const handleAutostartToggle = async () => {
        const newValue = !settings.autostart;
        await settings.updateSettings({ autostart: newValue });
        await setAutostart(newValue);
    };

    const handleSave = async () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex flex-col">
            {/* Header */}
            <header className="flex items-center gap-3 p-4 border-b border-dark-200 dark:border-dark-800">
                <button
                    onClick={onBack}
                    className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-dark-600 dark:text-dark-400" />
                </button>
                <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5 text-neon-500 dark:text-neon-400" />
                    <h1 className="text-lg font-semibold text-dark-900 dark:text-white">Ayarlar</h1>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Timer Duration */}
                <section className="bg-white dark:bg-dark-900 rounded-xl p-5 border border-dark-200 dark:border-dark-700">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-neon-500 dark:text-neon-400" />
                        <h2 className="font-semibold text-dark-900 dark:text-white">Süre</h2>
                    </div>

                    <div className="flex gap-2 flex-wrap mb-4">
                        {intervals.map((min) => (
                            <button
                                key={min}
                                onClick={() => handleIntervalChange(min)}
                                className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${settings.intervalMinutes === min
                                    ? 'bg-neon-500 text-white shadow-neon'
                                    : 'bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700'
                                    }`}
                            >
                                {min} dk
                            </button>
                        ))}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-dark-500 dark:text-dark-400 mb-2 uppercase tracking-wide">
                            Özel Süre
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={settings.intervalMinutes}
                                onChange={(e) => handleIntervalChange(parseInt(e.target.value) || 60)}
                                min="1"
                                max="999"
                                className="flex-1 px-4 py-2.5 rounded-lg border border-dark-200 dark:border-dark-600 bg-dark-50 dark:bg-dark-800 text-dark-900 dark:text-white focus:ring-2 focus:ring-neon-500 focus:border-transparent transition-all"
                            />
                            <span className="text-dark-500 dark:text-dark-400 text-sm">dakika</span>
                        </div>
                    </div>
                </section>

                {/* Notification Mode */}
                <section className="bg-white dark:bg-dark-900 rounded-xl p-5 border border-dark-200 dark:border-dark-700">
                    <div className="flex items-center gap-2 mb-4">
                        <Bell className="w-5 h-5 text-neon-500 dark:text-neon-400" />
                        <h2 className="font-semibold text-dark-900 dark:text-white">Bildirim Modu</h2>
                    </div>

                    <div className="space-y-2">
                        <button
                            onClick={() => settings.updateSettings({ mode: 'confirm' })}
                            className={`w-full text-left p-4 rounded-lg border transition-all ${settings.mode === 'confirm'
                                ? 'border-neon-500 bg-neon-500/5 dark:bg-neon-400/10'
                                : 'border-dark-200 dark:border-dark-700 hover:border-dark-300 dark:hover:border-dark-600'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-dark-900 dark:text-white">Manuel Onay</div>
                                    <div className="text-sm text-dark-500 dark:text-dark-400 mt-0.5">
                                        Süre dolunca bekler, manuel olarak yeniden başlatırsınız
                                    </div>
                                </div>
                                {settings.mode === 'confirm' && (
                                    <Check className="w-5 h-5 text-neon-500 dark:text-neon-400" />
                                )}
                            </div>
                        </button>

                        <button
                            onClick={() => settings.updateSettings({ mode: 'auto' })}
                            className={`w-full text-left p-4 rounded-lg border transition-all ${settings.mode === 'auto'
                                ? 'border-neon-500 bg-neon-500/5 dark:bg-neon-400/10'
                                : 'border-dark-200 dark:border-dark-700 hover:border-dark-300 dark:hover:border-dark-600'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-dark-900 dark:text-white">Otomatik</div>
                                    <div className="text-sm text-dark-500 dark:text-dark-400 mt-0.5">
                                        Süre dolunca otomatik olarak yeniden başlar
                                    </div>
                                </div>
                                {settings.mode === 'auto' && (
                                    <Check className="w-5 h-5 text-neon-500 dark:text-neon-400" />
                                )}
                            </div>
                        </button>
                    </div>
                </section>

                {/* Theme */}
                <section className="bg-white dark:bg-dark-900 rounded-xl p-5 border border-dark-200 dark:border-dark-700">
                    <div className="flex items-center gap-2 mb-4">
                        {theme === 'dark' ? <Moon className="w-5 h-5 text-neon-500 dark:text-neon-400" /> :
                            theme === 'light' ? <Sun className="w-5 h-5 text-neon-500 dark:text-neon-400" /> :
                                <Monitor className="w-5 h-5 text-neon-500 dark:text-neon-400" />}
                        <h2 className="font-semibold text-dark-900 dark:text-white">Tema</h2>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: 'light', icon: Sun, label: 'Açık' },
                            { id: 'dark', icon: Moon, label: 'Koyu' },
                            { id: 'system', icon: Monitor, label: 'Sistem' },
                        ].map(({ id, icon: Icon, label }) => (
                            <button
                                key={id}
                                onClick={() => setTheme(id as 'light' | 'dark' | 'system')}
                                className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${theme === id
                                    ? 'bg-neon-500 text-white'
                                    : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Toggles */}
                <section className="bg-white dark:bg-dark-900 rounded-xl border border-dark-200 dark:border-dark-700 divide-y divide-dark-200 dark:divide-dark-700">
                    {/* DND Toggle */}
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            {settings.dnd ? <BellOff className="w-5 h-5 text-amber-500" /> : <Bell className="w-5 h-5 text-dark-400" />}
                            <div>
                                <div className="font-medium text-dark-900 dark:text-white">Rahatsız Etme</div>
                                <div className="text-sm text-dark-500 dark:text-dark-400">Bildirimleri sustur</div>
                            </div>
                        </div>
                        <button
                            onClick={() => settings.updateSettings({ dnd: !settings.dnd })}
                            className={`relative w-12 h-7 rounded-full transition-colors ${settings.dnd ? 'bg-neon-500' : 'bg-dark-300 dark:bg-dark-600'
                                }`}
                        >
                            <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.dnd ? 'left-6' : 'left-1'
                                }`} />
                        </button>
                    </div>

                    {/* Sound Toggle */}
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-neon-500" /> : <VolumeX className="w-5 h-5 text-dark-400" />}
                            <div>
                                <div className="font-medium text-dark-900 dark:text-white">Bildirim Sesi</div>
                                <div className="text-sm text-dark-500 dark:text-dark-400">Süre dolunca ses çal</div>
                            </div>
                        </div>
                        <button
                            onClick={() => settings.updateSettings({ soundEnabled: !settings.soundEnabled })}
                            className={`relative w-12 h-7 rounded-full transition-colors ${settings.soundEnabled ? 'bg-neon-500' : 'bg-dark-300 dark:bg-dark-600'
                                }`}
                        >
                            <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.soundEnabled ? 'left-6' : 'left-1'
                                }`} />
                        </button>
                    </div>

                    {/* Always on Top */}
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <Pin className={`w-5 h-5 ${settings.alwaysOnTop ? 'text-neon-500' : 'text-dark-400'}`} />
                            <div>
                                <div className="font-medium text-dark-900 dark:text-white">Her Zaman Üstte</div>
                                <div className="text-sm text-dark-500 dark:text-dark-400">Popup penceresi üstte kalır</div>
                            </div>
                        </div>
                        <button
                            onClick={() => settings.updateSettings({ alwaysOnTop: !settings.alwaysOnTop })}
                            className={`relative w-12 h-7 rounded-full transition-colors ${settings.alwaysOnTop ? 'bg-neon-500' : 'bg-dark-300 dark:bg-dark-600'
                                }`}
                        >
                            <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.alwaysOnTop ? 'left-6' : 'left-1'
                                }`} />
                        </button>
                    </div>

                    {/* Autostart */}
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <Zap className={`w-5 h-5 ${settings.autostart ? 'text-neon-500' : 'text-dark-400'}`} />
                            <div>
                                <div className="font-medium text-dark-900 dark:text-white">Windows ile Başlat</div>
                                <div className="text-sm text-dark-500 dark:text-dark-400">Sistem açılışında gizli başlar</div>
                            </div>
                        </div>
                        <button
                            onClick={handleAutostartToggle}
                            className={`relative w-12 h-7 rounded-full transition-colors ${settings.autostart ? 'bg-neon-500' : 'bg-dark-300 dark:bg-dark-600'
                                }`}
                        >
                            <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.autostart ? 'left-6' : 'left-1'
                                }`} />
                        </button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="p-4 border-t border-dark-200 dark:border-dark-800">
                <button
                    onClick={handleSave}
                    className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all ${saved
                        ? 'bg-neon-500 text-white'
                        : 'bg-neon-500 hover:bg-neon-600 text-white shadow-neon hover:shadow-neon-lg'
                        }`}
                >
                    {saved ? (
                        <>
                            <Check className="w-5 h-5" />
                            Kaydedildi
                        </>
                    ) : (
                        'Kaydet'
                    )}
                </button>
            </footer>
        </div>
    );
}
