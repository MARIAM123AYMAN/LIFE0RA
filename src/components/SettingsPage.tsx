import { useState, useEffect } from 'react';
import { ArrowLeft, User, Bell, Lock, Palette, Target, Droplets, Utensils, Moon, Sun, Globe, Share2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '../utils/notifications';
import { useApp } from '../contexts/AppContext';
import { t } from '../utils/translations';
import { ShareProgressModal } from './ShareProgressModal';
import { getGoals, updateGoals } from "../services/userGoalService";
export function SettingsPage() {
  const navigate = useNavigate();
  const { darkMode, language, setDarkMode, setLanguage } = useApp();
  const userName = localStorage.getItem('userName') || 'User';
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
  const [showShareModal, setShowShareModal] = useState(false);

  // Calculate actual averages
  const [averages, setAverages] = useState({
    water: 0,
    steps: 0,
    cardio: 0,
  });

  useEffect(() => {
    // Calculate water average (from cups to ml)
    const waterCups = parseInt(localStorage.getItem('waterCups') || '0');
    const avgWater = waterCups * 250; // Convert cups to ml

    // Calculate steps average (simulated from goal * 0.7)
    const stepsGoal = parseInt(localStorage.getItem('dailyStepsGoal') || '10000');
    const avgSteps = Math.round(stepsGoal * 0.7);

    // Calculate cardio average from workout history
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const totalMinutes = workoutHistory.reduce((sum: number, workout: any) => sum + workout.duration, 0);
    const avgCardio = workoutHistory.length > 0 ? Math.round(totalMinutes / 7) : 0;

    setAverages({
      water: avgWater,
      steps: avgSteps,
      cardio: avgCardio,
    });
  }, []);

  // Settings state
  const [settings, setSettings] = useState({
    // Profile
    name: userName,
    email: userEmail,
    // Notifications
    waterReminders: localStorage.getItem('waterReminders') !== 'false',
    mealReminders: localStorage.getItem('mealReminders') !== 'false',
    workoutReminders: localStorage.getItem('workoutReminders') !== 'false',
    
    // Goals
    dailyWaterGoal: 0,
    dailyCalorieGoal: 0,
    dailyStepsGoal: 10000, // أو ثابته لو ملهاش API
    dailyCardioGoal: 0,
  });
  const loadGoals = async () => {
    const { data } = await getGoals();
    
    setSettings(prev => ({
      ...prev,
      dailyWaterGoal: data.waterGoal,
      dailyCalorieGoal: data.caloriesGoal,
      dailyCardioGoal: data.activityGoal,
    }));
};

useEffect(() => {
  loadGoals();
}, []);
const handleSave = async () => {
  // Save to localStorage
  localStorage.setItem(
    "stepsGoal",
  settings.dailyStepsGoal.toString()
);
 await updateGoals({
  waterGoal: settings.dailyWaterGoal,
  caloriesGoal: settings.dailyCalorieGoal,
  activityGoal: settings.dailyCardioGoal,
});

notifications.settingsSaved();
  };
return (
  <div className="min-h-screen p-4 md:p-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-300 mb-4 transition-colors"
          title={t('backToDashboard', language)}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('backToDashboard', language)}</span>
        </button>
        <h1 className="text-sky-900 dark:text-sky-100 mb-2">{t('settings', language)}</h1>
        <p className="text-sky-600 dark:text-sky-400">{t('managePreferences', language)}</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
              <User className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h2 className="text-sky-900 dark:text-sky-100">{t('profile', language)}</h2>
              <p className="text-sm text-sky-600 dark:text-sky-400">{t('accountInfo', language)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-sky-700 dark:text-sky-300 mb-2">{t('fullName', language)}</label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-sky-50 dark:bg-gray-700 border border-sky-100 dark:border-gray-600 text-sky-900 dark:text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-600"
              />
            </div>
            <div>
              <label className="block text-sm text-sky-700 dark:text-sky-300 mb-2">{t('emailAddress', language)}</label>
              <input
                type="email"
                value={settings.email}
                disabled
                className="w-full px-4 py-3 rounded-2xl bg-sky-50 dark:bg-gray-700 border border-sky-100 dark:border-gray-600 text-sky-600 dark:text-sky-400 cursor-not-allowed"
                title={t('emailCannotChange', language)}
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <Bell className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-sky-900 dark:text-sky-100">{t('notifications', language)}</h2>
              <p className="text-sm text-sky-600 dark:text-sky-400">{t('manageReminders', language)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-sky-50 dark:bg-gray-700 transition-all hover:shadow-md">
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <div>
                  <p className="text-sky-900 dark:text-sky-100">{t('waterReminders', language)}</p>
                  <p className="text-xs text-sky-600 dark:text-sky-400">{t('waterRemindersDesc', language)}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.waterReminders}
                  onChange={(e) => setSettings({ ...settings, waterReminders: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-sky-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-sky-300 dark:after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600 dark:peer-checked:bg-sky-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-sky-50 dark:bg-gray-700 transition-all hover:shadow-md">
              <div className="flex items-center gap-3">
                <Utensils className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <div>
                  <p className="text-sky-900 dark:text-sky-100">{t('mealReminders', language)}</p>
                  <p className="text-xs text-sky-600 dark:text-sky-400">{t('mealRemindersDesc', language)}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.mealReminders}
                  onChange={(e) => setSettings({ ...settings, mealReminders: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-sky-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-sky-300 dark:after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600 dark:peer-checked:bg-orange-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-sky-50 dark:bg-gray-700 transition-all hover:shadow-md">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sky-900 dark:text-sky-100">{t('workoutReminders', language)}</p>
                  <p className="text-xs text-sky-600 dark:text-sky-400">{t('workoutRemindersDesc', language)}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.workoutReminders}
                  onChange={(e) => setSettings({ ...settings, workoutReminders: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-sky-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-sky-300 dark:after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Goals Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-mint-100 dark:bg-mint-900 flex items-center justify-center">
              <Target className="w-6 h-6 text-mint-600 dark:text-mint-400" />
            </div>
            <div>
              <h2 className="text-sky-900 dark:text-sky-100">{t('dailyGoals', language)}</h2>
              <p className="text-sm text-sky-600 dark:text-sky-400">{t('setTargets', language)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm text-sky-700 dark:text-sky-300">{t('waterGoal', language)}</label>
                {/* <span className="text-xs text-mint-600 dark:text-mint-400">
                  {t('currentAverage', language)}: {averages.water} ml
                </span> */}
              </div>
              <input
                type="number"
                value={settings.dailyWaterGoal}
                onChange={(e) => setSettings({ ...settings, dailyWaterGoal: parseInt(e.target.value) || 2000 })}
                className="w-full px-4 py-3 rounded-2xl bg-sky-50 dark:bg-gray-700 border border-sky-100 dark:border-gray-600 text-sky-900 dark:text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-600"
                min="500"
                max="5000"
                step="250"
              />
            </div>

            <div>
              <label className="block text-sm text-sky-700 dark:text-sky-300 mb-2">{t('calorieGoal', language)}</label>
              <input
                type="number"
                value={settings.dailyCalorieGoal}
                onChange={(e) => setSettings({ ...settings, dailyCalorieGoal: parseInt(e.target.value) || 2000 })}
                className="w-full px-4 py-3 rounded-2xl bg-sky-50 dark:bg-gray-700 border border-sky-100 dark:border-gray-600 text-sky-900 dark:text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-600"
                min="1000"
                max="5000"
                step="100"
              />
            </div>

            {/* <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm text-sky-700 dark:text-sky-300">{t('stepsGoal', language)}</label>
                <span className="text-xs text-mint-600 dark:text-mint-400">
                  {t('currentAverage', language)}: {averages.steps.toLocaleString()} {t('steps', language)}
                </span>
              </div>
              <input
                type="number"
                value={settings.dailyStepsGoal}
                onChange={(e) => setSettings({ ...settings, dailyStepsGoal:
Number(localStorage.getItem("stepsGoal")) || 10000 })}
                className="w-full px-4 py-3 rounded-2xl bg-sky-50 dark:bg-gray-700 border border-sky-100 dark:border-gray-600 text-sky-900 dark:text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-600"
                min="1000"
                max="30000"
                step="1000"
              />
            </div> */}

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm text-sky-700 dark:text-sky-300">{t('cardioGoal', language)}</label>
                {/* <span className="text-xs text-mint-600 dark:text-mint-400">
                  {t('currentAverage', language)}: {averages.cardio} {t('min', language)}
                </span> */}
              </div>
              <input
                type="number"
                value={settings.dailyCardioGoal}
                onChange={(e) => setSettings({ ...settings, dailyCardioGoal: parseInt(e.target.value) || 30 })}
                className="w-full px-4 py-3 rounded-2xl bg-sky-50 dark:bg-gray-700 border border-sky-100 dark:border-gray-600 text-sky-900 dark:text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-600"
                min="10"
                max="120"
                step="5"
              />
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-sky-900 dark:text-sky-100">{t('appearance', language)}</h2>
              <p className="text-sm text-sky-600 dark:text-sky-400">{t('customizeExperience', language)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-sky-50 dark:bg-gray-700 transition-all hover:shadow-md">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5 text-sky-600 dark:text-sky-400" /> : <Sun className="w-5 h-5 text-sky-600 dark:text-sky-400" />}
                <div>
                  <p className="text-sky-900 dark:text-sky-100">{t('darkMode', language)}</p>
                  <p className="text-xs text-sky-600 dark:text-sky-400">
                    {darkMode ? (language === 'en' ? 'Enabled' : 'مفعّل') : (language === 'en' ? 'Disabled' : 'معطّل')}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-sky-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-sky-300 dark:after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600 dark:peer-checked:bg-sky-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-sky-50 dark:bg-gray-700 transition-all hover:shadow-md">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <div>
                  <p className="text-sky-900 dark:text-sky-100">{t('language', language)}</p>
                  <p className="text-xs text-sky-600 dark:text-sky-400">
                    {language === 'en' ? 'English' : 'العربية'}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={language === 'ar'}
                  onChange={(e) => setLanguage(e.target.checked ? 'ar' : 'en')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-sky-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-sky-300 dark:after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 dark:peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Share Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="text-sky-900 dark:text-sky-100">{t('shareData', language)}</h2>
              <p className="text-sm text-sky-600 dark:text-sky-400">{t('shareDataDesc', language)}</p>
            </div>
          </div>

          <button
            onClick={() => setShowShareModal(true)}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-r from-sky-500 to-mint-500 hover:from-sky-600 hover:to-mint-600 text-white transition-all shadow-lg hover:shadow-xl"
          >
            <Share2 className="w-5 h-5" />
            <span>{language === 'en' ? 'Share My Progress' : 'شارك تقدمي'}</span>
          </button>
        </div>

        {/* Redo Onboarding */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sky-900 dark:text-sky-100">
                {language === 'en' ? 'Personalization' : 'التخصيص'}
              </h2>
              <p className="text-sm text-sky-600 dark:text-sky-400">
                {language === 'en' ? 'Update your health profile and goals' : 'تحديث ملفك الصحي وأهدافك'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('onboardingComplete');
              navigate('/onboarding');
            }}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition-all shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="w-5 h-5" />
            <span>{language === 'en' ? 'Redo Onboarding' : 'إعادة التخصيص'}</span>
          </button>
        </div>

        {/* Save Button */}
        <div className="sticky bottom-24 md:bottom-8">
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-sky-900 dark:bg-sky-700 text-white hover:bg-sky-800 dark:hover:bg-sky-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            {t('saveSettings', language)}
          </button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareProgressModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
    </div>
  );
}