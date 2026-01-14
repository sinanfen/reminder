import { useTimerStore } from '../stores/timerStore';
import { useSettingsStore } from '../stores/settingsStore';
import { Clock, X, RotateCcw, Check, BellOff } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PopupWindowProps {
    onClose: () => void;
}

export function PopupWindow({ onClose }: PopupWindowProps) {
    const { resetAndStart, pause } = useTimerStore();
    const settings = useSettingsStore();
    const [countdown, setCountdown] = useState(10);

    // Auto mode: countdown and auto-restart
    useEffect(() => {
        if (settings.mode === 'auto') {
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        resetAndStart();
                        onClose();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [settings.mode, resetAndStart, onClose]);

    const handleOk = () => {
        pause();
        onClose();
    };

    const handleOkRestart = () => {
        resetAndStart();
        onClose();
    };

    const toggleDnd = () => {
        settings.updateSettings({ dnd: !settings.dnd });
    };

    return (
        <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center sm:justify-end p-4 sm:p-8">
            <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl w-full max-w-sm border border-dark-200 dark:border-dark-700 overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="bg-neon-500 dark:bg-neon-600 p-6 text-white">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Süre Doldu</h2>
                                <p className="text-white/80 text-sm mt-0.5">
                                    {settings.intervalMinutes} dakikalık mola zamanı
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Message */}
                    <div className="bg-dark-50 dark:bg-dark-800 rounded-xl p-4 text-center border border-dark-200 dark:border-dark-700">
                        <p className="text-dark-700 dark:text-dark-300">
                            Ekrandan uzaklaşın, gözlerinizi dinlendirin
                        </p>
                        <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
                            Kısa bir mola verin ve hareket edin
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                        {settings.mode === 'confirm' ? (
                            <>
                                <button
                                    onClick={handleOkRestart}
                                    className="w-full flex items-center justify-center gap-2 bg-neon-500 hover:bg-neon-600 text-white font-semibold py-3 rounded-xl transition-all shadow-neon hover:shadow-neon-lg"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                    Tamam + Yeniden Başlat
                                </button>
                                <button
                                    onClick={handleOk}
                                    className="w-full flex items-center justify-center gap-2 bg-dark-100 hover:bg-dark-200 dark:bg-dark-800 dark:hover:bg-dark-700 text-dark-700 dark:text-dark-300 font-semibold py-3 rounded-xl transition-colors border border-dark-200 dark:border-dark-600"
                                >
                                    <Check className="w-5 h-5" />
                                    Tamam
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="text-center py-2">
                                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-dark-100 dark:bg-dark-800 text-2xl font-bold text-neon-500 dark:text-neon-400 mb-2">
                                        {countdown}
                                    </span>
                                    <p className="text-sm text-dark-500 dark:text-dark-400">
                                        saniye içinde otomatik devam edilecek
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-full flex items-center justify-center gap-2 bg-dark-100 hover:bg-dark-200 dark:bg-dark-800 dark:hover:bg-dark-700 text-dark-700 dark:text-dark-300 font-semibold py-3 rounded-xl transition-colors border border-dark-200 dark:border-dark-600"
                                >
                                    Kapat
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-800/50">
                    <button
                        onClick={toggleDnd}
                        className="flex items-center gap-2 text-sm text-dark-500 dark:text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 transition-colors"
                    >
                        <BellOff className="w-4 h-4" />
                        {settings.dnd ? 'DND Kapat' : 'DND Aç'}
                    </button>
                </div>
            </div>
        </div>
    );
}
