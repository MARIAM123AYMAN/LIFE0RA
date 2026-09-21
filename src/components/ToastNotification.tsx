import { useEffect, useState } from 'react';
import { X, Lightbulb } from 'lucide-react';

interface ToastNotificationProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function ToastNotification({ message, onClose, duration = 5000 }: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slide in animation
    setTimeout(() => setIsVisible(true), 100);

    // Auto close after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 max-w-md w-full mx-4 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-sky-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-sky-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-sky-900">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="w-8 h-8 rounded-lg bg-sky-50 hover:bg-sky-100 flex items-center justify-center text-sky-600 transition-colors flex-shrink-0"
            title="Dismiss tip"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Toast Manager Component
export function ToastManager() {
  const [currentToast, setCurrentToast] = useState<string | null>(null);
  const [toastIndex, setToastIndex] = useState(0);

  const tips = [
    'Drink water before your workout to stay hydrated',
    'Avoid caffeine after 6 PM for better sleep',
    'Warm up for 5-10 minutes before intense training',
    'Rest is important – give muscles 48 hours to recover',
    'Consistency beats intensity – train regularly',
  ];

  useEffect(() => {
    // Show first tip after 3 seconds
    const initialTimer = setTimeout(() => {
      setCurrentToast(tips[0]);
      setToastIndex(1);
    }, 3000);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (currentToast === null && toastIndex < tips.length) {
      // Show next tip after 15 seconds
      const timer = setTimeout(() => {
        setCurrentToast(tips[toastIndex]);
        setToastIndex((prev) => prev + 1);
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [currentToast, toastIndex]);

  if (!currentToast) return null;

  return (
    <ToastNotification
      message={currentToast}
      onClose={() => setCurrentToast(null)}
    />
  );
}
