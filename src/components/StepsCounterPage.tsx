import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Footprints, Target, TrendingUp, Calendar, Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { t } from '../utils/translations';
import {
  getTodaySteps,
  getWeeklySteps,
  addStep,
  resetSteps,
} from "../services/stepsService";
export function StepsCounterPage() {
  const navigate = useNavigate();
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const { language } = useApp();

  
  // Get today's steps from localStorage

  
  const [motionSteps, setMotionSteps] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [todayData, setTodayData] = useState<any>(null);
  const todaySteps = todayData?.steps ?? 0;
  const dailyGoal = todayData?.goal ?? 0;
  const progress =
    dailyGoal > 0 ? (todaySteps / dailyGoal) * 100 : 0;
  
  const distance = todayData?.distance ?? 0;
  const calories = todayData?.calories ?? 0;
  const activeTime = todayData?.activeTime ?? 0;
  const remaining = todayData?.remaining ?? 0;
const [isCounting, setIsCounting] = useState(false);
  // Simulate step counting using device motion (simulated)
  // useEffect(() => {
  //   if (isCounting) {
  //     // Simulate steps being counted (in real app, would use device sensors)
  //     intervalRef.current = setInterval(() => {
  //       setMotionSteps(prev => {
  //         const newSteps = prev + 1;
  //         const newTotal = todaySteps + newSteps;
  //         setTodaySteps(newTotal);
  //         localStorage.setItem('todaySteps', newTotal.toString());
  //         return 0; // Reset motion counter
  //       });
  //     }, 1500); // Add 1 step every 1.5 seconds when counting
  //   } else {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //     }
  //   }


  //   return () => {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //     }
  //   };
  // }, [isCounting, todaySteps]);

  // const handleStartStop = () => {
  //   setIsCounting(!isCounting);
  // };

  // const handleReset = () => {
  //   if (confirm(language === 'en' ? 'Are you sure you want to reset today\'s steps?' : 'هل أنت متأكد من إعادة تعيين خطوات اليوم؟')) {
  //     setTodaySteps(0);
  //     setMotionSteps(0);
  //     localStorage.setItem('todaySteps', '0');
  //     setIsCounting(false);
  //   }
  // };

const stats = [
  {
    label: language === "en" ? "Distance" : "المسافة",
    value: `${distance} ${t("km", language)}`,
    icon: TrendingUp,
  },
  {
    label: language === "en" ? "Calories" : "السعرات",
    value: `${calories} ${t("kcal", language)}`,
    icon: Target,
  },
  {
    label: language === "en" ? "Active Time" : "الوقت النشط",
    value: `${activeTime} ${t("min", language)}`,
    icon: Calendar,
  },
];
const loadData = async () => {
  try {
    const today = await getTodaySteps();
    const week = await getWeeklySteps();

    setTodayData(today);
    setWeeklyData(week);

    console.log(today);
    console.log(week);
  } catch (err) {
    console.log(err);
  }
};
const handleStartStop = async () => {
  if (!isCounting) {
    // await addStep(2);
    await loadData();
  }
  // setIsCounting(!isCounting);
  setIsCounting((prev) => !prev);
};
const handleReset = async () => {
  if (
    confirm(
      language === "en"
        ? "Reset today's steps?"
        : "إعادة تعيين خطوات اليوم؟"
    )
  ) {
    await resetSteps();
    await loadData();
    setIsCounting(false);
  }
};
useEffect(() => {
  if (!isCounting) return;

  const interval = setInterval(async () => {
    try {
      await addStep(1);
      await loadData();
    } catch (err) {
      console.log(err);
    }
  }, 2000); // كل ثانيتين

  return () => clearInterval(interval);
}, [isCounting]);
    useEffect(() => {
  loadData();
}, []);
  return (
    <div className="min-h-screen p-4 md:p-8 pb-24 md:pb-8 bg-gradient-to-br from-sky-50 via-white to-mint-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/sports')}
          className="flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-300 mb-4 transition-colors"
          title={language === 'en' ? 'Back to Sports Dashboard' : 'العودة إلى لوحة الرياضة'}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back', language)}</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sky-900 dark:text-white mb-2">{t('stepsCounter', language)}</h1>
            <p className="text-sky-600 dark:text-gray-400">
              {language === 'en' ? 'Track your daily walking activity' : 'تتبع نشاط المشي اليومي'}
            </p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="p-3 rounded-2xl bg-white dark:bg-gray-800 border border-sky-200 dark:border-gray-700 text-sky-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-gray-700 transition-colors"
            title={t('settings', language)}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm mb-8">
        <div className="text-center mb-8">
          <h2 className="text-sky-900 dark:text-white mb-2">
            {language === 'en' ? "Today's Steps" : 'خط��ات اليوم'}
          </h2>
          <p className="text-sky-600 dark:text-gray-400 mb-6">
            {language === 'en' ? 'Keep moving to reach your goal!' : 'استمر في التحرك لتحقيق هدفك!'}
          </p>

          {/* Circular Progress */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-48 h-48 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#e0f2fe"
                className="dark:stroke-gray-700"
                strokeWidth="16"
              />
              {/* Progress circle */}
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="16"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Footprints className="w-8 h-8 text-sky-600 dark:text-sky-400 mb-2" />
              <p className="text-4xl text-sky-900 dark:text-white mb-1">{todaySteps.toLocaleString()}</p>
              <p className="text-sm text-sky-600 dark:text-gray-400">{t('of', language)} {dailyGoal.toLocaleString()}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-sky-100 dark:bg-gray-700 rounded-full h-3 mb-2">
            <div
              className="bg-sky-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
              title={`${progress.toFixed(1)}% of daily goal`}
            />
          </div>
          <p className="text-sm text-sky-600 dark:text-gray-400">
            {remaining > 0
              ? `${remaining.toLocaleString()} ${language === 'en' ? 'steps to go!' : 'خطوة متبقية!'}`
              : `🎉 ${language === 'en' ? 'Goal achieved!' : 'تم تحقيق الهدف!'}`}
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={handleStartStop}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-white transition-all shadow-lg hover:shadow-xl ${
              isCounting
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isCounting ? (
              <>
                <Pause className="w-5 h-5" />
                <span>{t('stopCounting', language)}</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>{t('startCounting', language)}</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-500 dark:bg-gray-700 hover:bg-gray-600 dark:hover:bg-gray-600 text-white transition-all shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{t('resetSteps', language)}</span>
          </button>
        </div>

        {/* Live Status */}
        {isCounting && (
          <div className="text-center p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <p className="text-green-700 dark:text-green-400 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {language === 'en' ? 'Step counting is active...' : 'عداد الخطوات نشط...'}
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-sky-50 dark:bg-gray-700 rounded-2xl p-4 text-center">
                <Icon className="w-5 h-5 text-sky-600 dark:text-sky-400 mx-auto mb-2" />
                <p className="text-xs text-sky-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-sky-900 dark:text-white font-medium">{stat.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm mb-8">
        <h2 className="text-sky-900 dark:text-white mb-6">
          {language === 'en' ? 'This Week' : 'هذا الأسبوع'}
        </h2>
        <div className="flex items-end justify-between gap-2 h-48">
          {weeklyData.map((day, index) => {
      const goal = Number(todayData?.goal) || 10000;
const barHeight = Math.min((day.steps / goal) * 100, 100);
            const isGoalMet = day.steps >= goal;
            console.log(day.steps);
console.log(day.day, barHeight);
console.log(barHeight);
console.log("day =", day);
console.log("goal =", dailyGoal);
console.log("todayData =", todayData);
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">

<div
  className="flex items-end justify-center"
  style={{
    height: "160px",
    width: "24px",
  }}
>
  <div
    className={`rounded-t-xl transition-all ${
      isGoalMet ? "bg-mint-400" : "bg-sky-300 dark:bg-sky-600"
    }`}
    style={{
      height: `${barHeight}%`,
      width: "24px",
    }}
  />
</div>

                <p className="text-xs text-sky-600 dark:text-gray-400">{day.day}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-sky-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-mint-400" />
            <span>{language === 'en' ? 'Goal Met' : 'تحقق الهدف'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-sky-300 dark:bg-sky-600" />
            <span>{language === 'en' ? 'In Progress' : 'قيد التنفيذ'}</span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-sky-100 to-mint-100 dark:from-gray-800 dark:to-gray-800 rounded-3xl p-6">
        <h3 className="text-sky-900 dark:text-white mb-3">
          💡 {language === 'en' ? 'Walking Tips' : 'نصائح المشي'}
        </h3>
        <ul className="space-y-2 text-sm text-sky-700 dark:text-gray-300">
          <li>• {language === 'en' ? 'Take short walking breaks every hour' : '��ذ فترات راحة قصيرة للمشي كل ساعة'}</li>
          <li>• {language === 'en' ? 'Use stairs instead of elevators' : 'استخدم السلالم بدلاً من المصاعد'}</li>
          <li>• {language === 'en' ? 'Park further away to add extra steps' : 'اركن بعيداً لإضافة خطوات إضافية'}</li>
          <li>• {language === 'en' ? 'Walk while on phone calls' : 'امشِ أثناء المكالمات الهاتفية'}</li>
        </ul>
      </div>
    </div>
  );
}