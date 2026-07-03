import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flame } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t } from '../utils/translations';

export function WorkoutTimerCard() {
  const { language } = useApp();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [caloriesBurned, setCaloriesBurned] = useState(0);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive) {
      interval = window.setInterval(() => {
        setSeconds((seconds) => seconds + 1);
        // Estimate: ~5 calories per minute
        setCaloriesBurned((prev) => prev + (5 / 60));
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setSeconds(0);
    setIsActive(false);
    setCaloriesBurned(0);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  localStorage.setItem(
"activitySeconds",
seconds.toString()
);

localStorage.setItem(
"activityCalories",
Math.round(caloriesBurned).toString()
);

  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm mb-8 border border-sky-100/50 dark:border-gray-700/50 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sky-900 dark:text-sky-100">{t('workoutTimer', language)}</h2>
          <p className="text-sm text-sky-600 dark:text-sky-400">{language === 'en' ? 'Track your active time' : 'تتبع وقت نشاطك'}</p>
        </div>
      </div>

      {/* Large Timer Display */}
      <div className="bg-sky-50 dark:bg-gray-800/50 rounded-3xl p-8 mb-6 text-center border border-sky-100/30 dark:border-gray-700/30">
        <div 
          className="text-6xl md:text-7xl text-sky-900 dark:text-sky-100 mb-4 tabular-nums font-bold"
          title="Current workout duration"
        >
          {formatTime(seconds)}
        </div>
        <div className="flex items-center justify-center gap-2 text-sky-600 dark:text-sky-400">
          <Flame className="w-5 h-5 text-orange-500" />
          <p title="Estimated calories burned based on moderate activity">
            <span className="text-2xl text-sky-900 dark:text-sky-100 font-bold">{Math.round(caloriesBurned)}</span> {t('kcal', language)} {language === 'en' ? 'burned' : 'محروقة'}
          </p>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleStartPause}
          className={`flex-1 px-6 py-4 rounded-2xl font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform active:scale-95 ${
            isActive
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-sky-900 dark:bg-sky-700 hover:bg-sky-800 dark:hover:bg-sky-600 text-white'
          }`}
          title={isActive ? 'Pause the timer' : 'Start the timer'}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5" />
              <span>{t('pauseTimer', language)}</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>{t('startTimer', language)}</span>
            </>
          )}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-4 rounded-2xl bg-sky-100 dark:bg-gray-700 hover:bg-sky-200 dark:hover:bg-gray-600 text-sky-900 dark:text-sky-100 transition-all flex items-center gap-2 border border-sky-200 dark:border-gray-600 shadow-sm"
          title="Reset timer to 00:00:00"
        >
          <RotateCcw className="w-5 h-5" />
          <span>{language === 'en' ? 'Reset' : 'إعادة'}</span>
        </button>
      </div>

      {/* Quick Info */}
      <div className="mt-4 p-4 bg-sky-50 dark:bg-sky-900/20 rounded-2xl border border-sky-100/50 dark:border-sky-800/50">
        <p className="text-sm text-sky-600 dark:text-sky-400">
          💡 {language === 'en' 
            ? 'The timer tracks your active workout time. Calories are estimated based on moderate intensity.' 
            : 'يتتبع المؤقت وقت تمرينك النشط. يتم تقدير السعرات الحرارية بناءً على شدة معتدلة.'}
        </p>
      </div>
    </div>
  );
}
