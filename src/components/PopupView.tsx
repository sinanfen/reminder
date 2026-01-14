import { useTimerStore } from '../stores/timerStore';
import { useSettingsStore } from '../stores/settingsStore';
import { closePopupWindow } from '../lib/window';
import { Clock, RotateCcw, Check, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * PopupView - Rendered in the separate popup window opened by Rust
 * This is a full-screen view that appears when timer expires
 */
export function PopupView() {
    const { resetAndStart, pause } = useTimerStore();
    const settings = useSettingsStore();
    const [countdown, setCountdown] = useState(10);

    // Load settings when mounted
    useEffect(() => {
        settings.loadSettings();
    }, []);

    // Auto mode: countdown and auto-restart
    useEffect(() => {
        if (settings.mode === 'auto' && settings.isLoaded) {
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        handleAutoClose();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [settings.mode, settings.isLoaded]);

    const handleAutoClose = () => {
        resetAndStart();
        closePopupWindow();
    };

    const handleOk = () => {
        pause();
        closePopupWindow();
    };

    const handleOkRestart = () => {
        resetAndStart();
        closePopupWindow();
    };

    const handleClose = () => {
        closePopupWindow();
    };

    return (
        <div className="w-full h-screen bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-neon-600 to-neon-500 px-6 py-5">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                        <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Mola Zamanı!</h1>
                        <p className="text-white/80 text-sm mt-0.5">
                            {settings.intervalMinutes} dakika tamamlandı
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 space-y-6">
                {/* Message */}
                <div className="text-center space-y-2">
                    <p className="text-dark-200 text-lg">
                        Ekrandan uzaklaşın, gözlerinizi dinlendirin
                    </p>
                    <p className="text-dark-400 text-sm">
                        Kısa bir mola verin ve hareket edin
                    </p>
                </div>

                {/* Actions */}
                <div className="w-full max-w-xs space-y-3">
                    {settings.mode === 'confirm' ? (
                        <>
                            <button
                                onClick={handleOkRestart}
                                className="w-full flex items-center justify-center gap-2 bg-neon-500 hover:bg-neon-600 text-white font-semibold py-3.5 rounded-xl transition-all shadow-neon hover:shadow-neon-lg text-base"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Tamam + Yeniden Başlat
                            </button>
                            <button
                                onClick={handleOk}
                                className="w-full flex items-center justify-center gap-2 bg-dark-700 hover:bg-dark-600 text-dark-200 font-semibold py-3.5 rounded-xl transition-colors border border-dark-600 text-base"
                            >
                                <Check className="w-5 h-5" />
                                Tamam (Duraklat)
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="text-center py-4">
                                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-800 border-2 border-neon-500 text-4xl font-bold text-neon-400 mb-3">
                                    {countdown}
                                </span>
                                <p className="text-sm text-dark-400">
                                    saniye içinde otomatik devam edilecek
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-full flex items-center justify-center gap-2 bg-dark-700 hover:bg-dark-600 text-dark-200 font-semibold py-3.5 rounded-xl transition-colors border border-dark-600 text-base"
                            >
                                Kapat
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-dark-700 bg-dark-800/50 flex items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-dark-400">
                    {settings.soundEnabled ? (
                        <Volume2 className="w-4 h-4 text-neon-400" />
                    ) : (
                        <VolumeX className="w-4 h-4" />
                    )}
                    <span>Ses {settings.soundEnabled ? 'Açık' : 'Kapalı'}</span>
                </div>
            </div>
        </div>
    );
}
