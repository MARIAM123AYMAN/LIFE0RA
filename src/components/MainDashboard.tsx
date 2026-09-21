import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Utensils, Droplets, Dumbbell, Settings, Calendar, Clock, Brain, LogOut } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getDashboard } from '../services/dashboardService';
import { notifications } from '../utils/notifications';
import { t } from '../utils/translations';
import { PersonalizedWelcome } from './PersonalizedWelcome';

export function MainDashboard() {
  const navigate = useNavigate();
  const { language, selectedDate, setSelectedDate } = useApp();
  const [dashboard, setDashboard] = useState<any>(null);
  
  const userName = localStorage.getItem('userName') || 'User';
  const userEmail = localStorage.getItem("userEmail");

  // جلب الوجبات وحساب السعرات الحرارية الحالية
  const breakfastMeals = JSON.parse(localStorage.getItem(`breakfastMeals_${userEmail}_${selectedDate}`) || "[]");
  const lunchMeals = JSON.parse(localStorage.getItem(`lunchMeals_${userEmail}_${selectedDate}`) || "[]");
  const dinnerMeals = JSON.parse(localStorage.getItem(`dinnerMeals_${userEmail}_${selectedDate}`) || "[]");

  const localCalories = [...breakfastMeals, ...lunchMeals, ...dinnerMeals].reduce((sum, meal) => sum + meal.calories, 0);

  // تغيير التاريخ لمتابعة السجلات
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  // التحقق من إتمام مرحلة التهيئة (Onboarding)
  useEffect(() => {
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    if (onboardingComplete !== 'true') {
      navigate('/onboarding');
    }
  }, [navigate]);

  // إرسال إشعار ترحيبي مخصص عند أول دخول للجلسة
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      const fitnessGoal = localStorage.getItem('userFitnessGoal') || 'stayFit';
      let goalMessage = '';

      if (language === 'en') {
        if (fitnessGoal === 'weightLoss') goalMessage = " Let's crush those weight loss goals!";
        else if (fitnessGoal === 'muscleGain') goalMessage = " Ready to build some muscle!";
        else if (fitnessGoal === 'stayFit') goalMessage = " Let's maintain that healthy lifestyle!";
        else goalMessage = " Let's achieve your wellness goals!";
      } else {
        if (fitnessGoal === 'weightLoss') goalMessage = " دعنا نحقق أهداف إنقاص الوزن!";
        else if (fitnessGoal === 'muscleGain') goalMessage = " لنبني بعض العضلات!";
        else if (fitnessGoal === 'stayFit') goalMessage = " دعنا نحافظ على نمط حياة صحي!";
        else goalMessage = " دعنا نحقق أهدافك الصحية!";
      }

      setTimeout(() => {
        notifications.mealAdded(t('welcomeBack', language) + ', ' + userName + goalMessage, 0);
      }, 1000);
      sessionStorage.setItem('hasSeenWelcome', 'true');
    }
  }, [language, userName]);

  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  // تحميل بيانات لوحة التحكم من السيرفر
  const loadDashboard = async () => {
    const { data } = await getDashboard();
    setDashboard(data);
    localStorage.setItem("dashboardDate", data.date.split("T")[0]);
    console.log(data);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    console.log(dashboard);
  }, [dashboard]);

  // حساب نسب الإنجاز بناءً على البيانات المستهدفة والحالية
  const caloriesGoal = 2000;
  const caloriesProgress = Math.min((localCalories / caloriesGoal) * 100, 100);
const waterProgress = Math.min(
  (dashboard?.water.current / dashboard?.water.goal) * 100,
  100
);
  const activityProgress = dashboard ? (dashboard.activity.current / dashboard.activity.goal) * 100 : 0;

  const getAISummary = () => dashboard?.healthTip ?? "";

  if (!dashboard) {
    return <p>Loading...</p>;
  }

  const caloriesExceeded = localCalories >= caloriesGoal;
  return (
    <div className="min-h-screen p-4 md:p-8 pb-24 md:pb-8 bg-background transition-colors duration-300">
      {/* Personalized Welcome Modal */}
      <PersonalizedWelcome />

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-mint-400 flex items-center justify-center text-2xl text-white shadow-lg">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-sky-900 dark:text-sky-100">{t('hello', language)}, {userName}! 👋</h1>
              <p className="text-sky-600 dark:text-sky-400">
                {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'ar-EG', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              to="/settings"
              className="p-3 rounded-2xl bg-card border border-sky-200 dark:border-gray-700 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
              title={t('settings', language)}
            >
              <Settings className="w-5 h-5" />
            </Link>
            
            <div className="relative">
              <button className="p-3 rounded-2xl bg-card border border-sky-200 text-sky-700 hover:bg-sky-50 transition-colors shadow-sm">
                <Calendar className="w-5 h-5" />
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            
            <button
              onClick={handleLogout}
              className="p-3 rounded-2xl bg-card border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
              title={t('logout', language)}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Balance Rings Section */}
      <div className="mb-8">
        <h2 className="text-sky-900 dark:text-sky-100 mb-6">{t('balanceRings', language)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Calories Ring */}
          <div className="bg-card rounded-3xl p-6 shadow-sm border border-sky-100/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-sky-900 dark:text-sky-100">{t('calories', language)}</h3>
                  <p className="text-xs text-sky-600 dark:text-sky-400">{t('meals', language)}</p>
                </div>
              </div>
            </div>

            {/* Progress Ring */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" className="text-orange-100 dark:text-orange-900/30" strokeWidth="12" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  className={caloriesExceeded ? "text-green-600 dark:text-green-500" : "text-orange-600 dark:text-orange-500"}
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - caloriesProgress / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl text-sky-900 dark:text-sky-100">{localCalories}</p>
                <p className="text-xs text-sky-600 dark:text-sky-400">{t('of', language)} 2000</p>
              </div>
            </div>

            <Link
              to="/meals"
              className="block w-full text-center px-4 py-2 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors text-sm"
            >
              {t('viewMeals', language)}
            </Link>
          </div>

          {/* Water Ring */}
          <div className="bg-card rounded-3xl p-6 shadow-sm border border-sky-100/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <h3 className="text-sky-900 dark:text-sky-100">{t('water', language)}</h3>
                  <p className="text-xs text-sky-600 dark:text-sky-400">{t('hydration', language)}</p>
                </div>
              </div>
            </div>

            {/* Progress Ring */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" className="text-sky-100 dark:text-sky-900/30" strokeWidth="12" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  className="text-sky-600 dark:text-sky-500"
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - waterProgress / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className={`text-2xl ${dashboard?.water.current >= dashboard?.water.goal
                  ? "text-green-600"
                  : "text-sky-900 dark:text-sky-100"
                    }`}
                        >{dashboard?.water.current}
                </p>
                <p className="text-xs text-sky-600 dark:text-sky-400">{t('of', language)} {dashboard?.water.goal} {t('cups', language)}</p>
              </div>
            </div>

            <Link
              to="/water"
              className="block w-full text-center px-4 py-2 rounded-2xl bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors text-sm"
            >
              {t('trackWater', language)}
            </Link>
          </div>

          {/* Activity Ring */}
          <div className="bg-card rounded-3xl p-6 shadow-sm border border-sky-100/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sky-900 dark:text-sky-100">{t('activity', language)}</h3>
                  <p className="text-xs text-sky-600 dark:text-sky-400">{t('sports', language)}</p>
                </div>
              </div>
            </div>

            {/* Progress Ring */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" className="text-purple-100 dark:text-purple-900/30" strokeWidth="12" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  className="text-purple-600 dark:text-purple-500"
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - activityProgress / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl text-sky-900 dark:text-sky-100">{dashboard?.activity.current}</p>
                <p className="text-xs text-sky-600 dark:text-sky-400">{t('of', language)} {dashboard?.activity.goal} {t('min', language)}</p>
              </div>
            </div>

            <Link
              to="/sports"
              className="block w-full text-center px-4 py-2 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-sm"
            >
              {t('viewSports', language)}
            </Link>
          </div>

        </div>
      </div>

      {/* Smart Assistant Card */}
      <div className="bg-gradient-to-r from-sky-100 to-mint-100 dark:from-sky-900/40 dark:to-mint-900/40 rounded-3xl p-6 mb-8 border border-sky-200/50 dark:border-sky-800/50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center flex-shrink-0 shadow-sm">
            <Brain className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sky-900 dark:text-sky-100 mb-2">{t('aiHealthAssistant', language)}</h3>
            <p className="text-sky-700 dark:text-sky-300">{getAISummary()}</p>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="mb-8">
        <h2 className="text-sky-900 dark:text-sky-100 mb-6">{t('quickAccess', language)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <Link
            to="/meals"
            className="bg-card rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group border border-sky-100/50 dark:border-gray-700/50"
          >
            <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Utensils className="w-7 h-7 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-sky-900 dark:text-sky-100 mb-2">{t('mealsModule', language)}</h3>
            <p className="text-sm text-sky-600 dark:text-sky-400">{t('trackNutrition', language)}</p>
          </Link>

          <Link
            to="/water"
            className="bg-card rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group border border-sky-100/50 dark:border-gray-700/50"
          >
            <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Droplets className="w-7 h-7 text-sky-600 dark:text-sky-400" />
            </div>
            <h3 className="text-sky-900 dark:text-sky-100 mb-2">{t('waterTracker', language)}</h3>
            <p className="text-sm text-sky-600 dark:text-sky-400">{t('monitorHydration', language)}</p>
          </Link>

          <Link
            to="/sports"
            className="bg-card rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group border border-sky-100/50 dark:border-gray-700/50"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Dumbbell className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sky-900 dark:text-sky-100 mb-2">{t('sportsDashboard', language)}</h3>
            <p className="text-sm text-sky-600 dark:text-sky-400">{t('accessWorkouts', language)}</p>
          </Link>
          
        </div>
      </div>
    </div>
  );
}