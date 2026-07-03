import { Brain, Target, Clock, Flame, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { t } from '../utils/translations';
import {getGoals , setDefaultGoals , updateGoals } from '../services/userGoalService'
// import { generateRecommendation } from "../services/coachService";
import { useEffect, useState } from 'react';
interface AISmartCoachPanelProps {
  currentGoal: string;
}

export function AISmartCoachPanel({ currentGoal }: AISmartCoachPanelProps) {
  const { language, fitnessGoal } = useApp();
  const [goal,setGoal]=useState<any>(null);
const [loading,setLoading]=useState(true);

const [saving,setSaving]=useState(false);
  const [todayPlan, setTodayPlan] = useState<any>(null);
  // Get personalized data from onboarding
  const activityLevel = localStorage.getItem('userActivityLevel') || 'moderate';
  // const fitnessGoal = localStorage.getItem('userFitnessGoal') || 'stayFit';
  const healthConditions = JSON.parse(localStorage.getItem('userHealthConditions') || '[]');
  const loadGoal = async () => {
   try{

      const {data}=await getGoals();

      setGoal(data);

   }catch{
    await setDefaultGoals();
    const {data}=await getGoals();
    setGoal(data);}finally{

      setLoading(false);}
}
const saveGoals=async()=>{

setSaving(true);

try{

await updateGoals({

caloriesGoal:goal.caloriesGoal,

waterGoal:goal.waterGoal,

activityGoal:goal.activityGoal

});

alert("Goals Updated");

}

finally{

setSaving(false);

}

}

useEffect(() => {
 const goal = fitnessGoal;

  if (!goal) return;

  switch (goal) {
    case "Lose Weight":
      setTodayPlan({
        workout: "Running",
        duration: 30,
        calories: 300,
        message: "Today's focus is burning fat with cardio.",
      });
      break;

    case "Gain Muscle":
      setTodayPlan({
        workout: "Upper Body Strength",
        duration: 45,
        calories: 250,
        message: "Focus on strength and progressive overload.",
      });
      break;

    case "Walk & Stay Active":
      setTodayPlan({
        workout: "Brisk Walking",
        duration: 40,
        calories: 180,
        message: "Stay active and reach your daily step goal.",
      });
      break;

    case "Stay Healthy":
      setTodayPlan({
        workout: "Full Body Workout",
        duration: 35,
        calories: 220,
        message: "A balanced workout for overall health.",
      });
      break;

    case "Improve Fitness":
      setTodayPlan({
        workout: "HIIT",
        duration: 30,
        calories: 320,
        message: "Improve endurance with interval training.",
      });
      break;

    case "Reduce Stress":
      setTodayPlan({
        workout: "Yoga",
        duration: 25,
        calories: 120,
        message: "Relax your body and reduce stress.",
      });
      break;

    case "Rehabilitation":
      setTodayPlan({
        workout: "Mobility Exercises",
        duration: 20,
        calories: 90,
        message: "Gentle recovery exercises for mobility.",
      });
      break;

    case "Event Preparation":
      setTodayPlan({
        workout: "Sport Specific Training",
        duration: 60,
        calories: 450,
        message: "Prepare for your upcoming event.",
      });
      break;
  }
}, []);
useEffect(() => {
  loadGoal()
}, []);
// const todayPlan = {
//   workout: "Running",
//   duration: goal?.activityGoal ?? 30,
//   calories: Math.round((goal?.activityGoal ?? 30) * 8),
//   message: "Today's goal is to stay active and complete your workout."
// };
if (!todayPlan) return null;
  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm mb-8 border border-sky-100/50 dark:border-gray-700/50 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
          <Brain className="w-7 h-7 text-sky-600 dark:text-sky-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-sky-900 dark:text-sky-100">{t('aiCoach', language)}</h2>
          <p className="text-sm text-sky-600 dark:text-sky-400">{language === 'en' ? 'AI-powered workout recommendations' : 'توصيات تمارين مدعومة بالذكاء الاصطناعي'}</p>
        </div>
        <Link
          to="/sports/goal"
          className="text-sm text-sky-600 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-300 transition-colors"
          title={language === 'en' ? 'Change your fitness goal' : 'تغيير هدف لياقتك'}
        >
          {language === 'en' ? 'Change Goal' : 'تغيير الهدف'}
        </Link>
      </div>

      {/* Current Goal Display */}
      <div className="bg-sky-50 dark:bg-gray-800 rounded-2xl p-4 mb-6 border border-sky-100/30 dark:border-gray-700/30">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <p className="text-sm text-sky-600 dark:text-sky-400">{language === 'en' ? 'Your Current Goal' : 'هدفك الحالي'}</p>
        </div>
        <p className="text-xl text-sky-900 dark:text-sky-100 font-bold">{fitnessGoal || currentGoal}</p>
      </div>

      {/* Today's Recommendation */}
      <div className="border-t border-sky-100 dark:border-gray-700 pt-6">
        <p className="text-sm text-sky-600 dark:text-sky-400 mb-4">{language === 'en' ? 'Recommended for Today' : 'موصى به لليوم'}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Workout Type */}
          <div className="bg-sky-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-sky-100/20 dark:border-gray-700/20">
            <p className="text-xs text-sky-600 dark:text-sky-400 mb-2">{language === 'en' ? 'Workout Type' : 'نوع التمرين'}</p>
            <p className="text-sky-900 dark:text-sky-100 font-medium">{todayPlan.workout}</p>
          </div>

          {/* Duration */}


          <div className="bg-sky-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-sky-100/20 dark:border-gray-700/20" title="Recommended workout duration">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <p className="text-xs text-sky-600 dark:text-sky-400">{t('duration', language)}</p>
            </div>
            <p className="text-sky-900 dark:text-sky-100 font-medium">{todayPlan.duration} {t('min', language)}</p>
          </div>

          {/* Expected Calories */}
          <div className="bg-sky-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-sky-100/20 dark:border-gray-700/20" title="Estimated calories you'll burn">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <p className="text-xs text-sky-600 dark:text-sky-400">{language === 'en' ? 'Expected Burn' : 'الحرق المتوقع'}</p>
            </div>
            <p className="text-sky-900 dark:text-sky-100 font-medium">{todayPlan.calories} {t('kcal', language)}</p>
          </div>
        </div>
        {/* AI Message */}
        <div className="bg-gradient-to-r from-sky-100 to-sky-50 dark:from-sky-900/30 dark:to-gray-800/30 rounded-2xl p-4 mb-4 border border-sky-100/50 dark:border-sky-800/50">
          <p className="text-sky-900 dark:text-sky-100">
  💡 {todayPlan.message}
</p>
        </div>

        {/* Start Button */}
        {/* <button 
          className="w-full md:w-auto px-6 py-3 rounded-2xl bg-sky-900 dark:bg-sky-700 text-white hover:bg-sky-800 dark:hover:bg-sky-600 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform active:scale-95"
          title={language === 'en' ? "Start your recommended workout" : "ابدأ تمرينك الموصى به"}
        >
          <span>{language === 'en' ? "Start Today's Workout" : "ابدأ تمرين اليوم"}</span>
          <ArrowRight className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
        </button> */}
      </div>
    </div>
  );
}