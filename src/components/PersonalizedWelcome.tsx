import { useState, useEffect } from 'react';
import { CheckCircle, Target, Droplet, Activity, Sparkles, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { translations } from '../utils/translations';

interface UserRecommendations {
  calorieTarget: number;
  waterGoal: number;
  workoutType: string;
  bmr: number;
  tdee: number;
}

export function PersonalizedWelcome() {
  const { language } = useApp();
  const t = translations[language];
  const [showWelcome, setShowWelcome] = useState(false);
  const [recommendations, setRecommendations] = useState<UserRecommendations | null>(null);
  const userName = localStorage.getItem('userName') || 'Friend';

  useEffect(() => {
    // Check if user just completed onboarding
    const justCompletedOnboarding = localStorage.getItem('showWelcomeMessage');
    const recs = localStorage.getItem('userRecommendations');
    
    if (justCompletedOnboarding === 'true' && recs) {
      setRecommendations(JSON.parse(recs));
      setShowWelcome(true);
      // Clear the flag
      localStorage.removeItem('showWelcomeMessage');
    }
  }, []);

  const handleClose = () => {
    setShowWelcome(false);
  };

  if (!showWelcome || !recommendations) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-sky-500 to-mint-500 p-8 rounded-t-3xl">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {language === 'en' ? `Welcome, ${userName}!` : `مرحباً، ${userName}!`}
            </h2>
            <p className="text-white/90">
              {language === 'en' 
                ? 'Your personalized health plan is ready' 
                : 'خطتك الصحية المخصصة جاهزة'}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'en' ? 'Your Personalized Targets' : 'أهدافك المخصصة'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {language === 'en' 
                ? 'Based on your profile, we\'ve created these custom goals for you' 
                : 'بناءً على ملفك الشخصي، قمنا بإنشاء هذه الأهداف المخصصة لك'}
            </p>
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Calorie Target */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                    {language === 'en' ? 'Daily Calories' : 'السعرات اليومية'}
                  </div>
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-300">
                    {recommendations.calorieTarget} {t.kcal}
                  </div>
                </div>
              </div>
              <p className="text-xs text-orange-700 dark:text-orange-400">
                {language === 'en' 
                  ? 'Optimized for your goals and activity level' 
                  : 'محسّن لأهدافك ومستوى نشاطك'}
              </p>
            </div>

            {/* Water Goal */}
            <div className="bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900/20 dark:to-sky-800/20 rounded-2xl p-6 border border-sky-200 dark:border-sky-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center">
                  <Droplet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-sky-600 dark:text-sky-400 font-medium">
                    {language === 'en' ? 'Daily Water' : 'الماء اليومي'}
                  </div>
                  <div className="text-2xl font-bold text-sky-900 dark:text-sky-300">
                    {recommendations.waterGoal} {t.ml}
                  </div>
                </div>
              </div>
              <p className="text-xs text-sky-700 dark:text-sky-400">
                {language === 'en' 
                  ? 'Based on your body weight' 
                  : 'بناءً على وزن جسمك'}
              </p>
            </div>

            {/* Workout Type */}
            <div className="bg-gradient-to-br from-mint-50 to-mint-100 dark:from-mint-900/20 dark:to-mint-800/20 rounded-2xl p-6 border border-mint-200 dark:border-mint-800 md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-mint-500 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-mint-600 dark:text-mint-400 font-medium">
                    {language === 'en' ? 'Recommended Workout' : 'التمرين الموصى به'}
                  </div>
                  <div className="text-2xl font-bold text-mint-900 dark:text-mint-300">
                    {recommendations.workoutType}
                  </div>
                </div>
              </div>
              <p className="text-xs text-mint-700 dark:text-mint-400">
                {language === 'en' 
                  ? 'Tailored to your fitness goal and health condition' 
                  : 'مُصمم خصيصاً لهدفك الصحي وحالتك البدنية'}
              </p>
            </div>
          </div>

          {/* AI Message */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-purple-900 dark:text-purple-300 mb-2">
                  {language === 'en' ? 'AI Coach Message' : 'رسالة من المدرب الذكي'}
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-400">
                  {language === 'en' 
                    ? `Great! I've analyzed your profile and created a personalized plan. Your BMR is ${recommendations.bmr} kcal, and with your activity level, you burn approximately ${recommendations.tdee} kcal per day. I'll be here to guide you every step of the way. Let's achieve your goals together!`
                    : `رائع! قمت بتحليل ملفك الشخصي وإنشاء خطة مخصصة. معدل الأيض الأساسي الخاص بك هو ${recommendations.bmr} سعرة، ومع مستوى نشاطك، تحرق حوالي ${recommendations.tdee} سعرة يومياً. سأكون هنا لإرشادك في كل خطوة. لنحقق أهدافك معاً!`}
                </p>
              </div>
            </div>
          </div>

          {/* Success Tips */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              {language === 'en' ? 'Tips for Success' : 'نصائح للنجاح'}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
                <span>
                  {language === 'en' 
                    ? 'Log your meals daily to track your calorie intake' 
                    : 'سجل وجباتك يومياً لتتبع السعرات الحرارية'}
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
                <span>
                  {language === 'en' 
                    ? 'Drink water consistently throughout the day' 
                    : 'اشرب الماء بانتظام طوال اليوم'}
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
                <span>
                  {language === 'en' 
                    ? 'Stay consistent with your workout routine' 
                    : 'كن منتظماً في روتين التمرين'}
                </span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleClose}
            className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-mint-500 text-white font-medium hover:shadow-lg transition-all"
          >
            {language === 'en' ? 'Start My Journey' : 'ابدأ رحلتي'}
          </button>
        </div>
      </div>
    </div>
  );
}
