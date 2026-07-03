import { PredefinedMeals } from './PredefinedMeals';
import { MealCategoryCard } from './MealCategoryCard';
import { NearbyRestaurants } from './NearbyRestaurants';
import { Calendar, Trash2, TrendingUp} from 'lucide-react';
import { useEffect, useState } from 'react';
// import { MealApiKeyModal } from './MealApiKeyModal';
import { useApp } from '../contexts/AppContext';
import { t } from '../utils/translations';
// import { text } from 'stream/consumers';
import jsPDF from "jspdf";



export function MealsOverview() {
  
  const { language } = useApp();
  const userEmail = localStorage.getItem("userEmail");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";} | null>(null);

   const [selectedDate, setSelectedDate] = useState(
  localStorage.getItem("selectedDate") ||
  new Date().toISOString().split("T")[0]
);
  const mealsKey = `selectedMeals_${userEmail}_${selectedDate}`;
  // API change date
 const handleDateChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  setSelectedDate(e.target.value);

  localStorage.setItem(
    "selectedDate",
    e.target.value
  );
};
  const [selectedMeals, setSelectedMeals] = useState<any[]>([]);
  // add recommended meals in lists
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [isMealTypeOpen, setIsMealTypeOpen] = useState(false);
  const openMealSelector = (meal: any) => {
  setSelectedMeal(meal);
  setIsMealTypeOpen(true);
};
  const addMealToToday = (meal: any) => {
    setMessage({
      text : t("mealAdded" , language),
      type : "success",
    });
    setTimeout(() => {
      setMessage(null);}, 2000);
  console.log("Clicked Meal:", meal);
  console.log("Current Meal ID:", meal.id);
  console.log(
      selectedMeals.map((m) => ({
          id: m.id,
          name: m.name,
      }))
  );
  const exists = selectedMeals.some(
      (m) =>
      m.name === meal.name, 
  );
  console.log("Exists:", exists);
  if (exists) return;
  const updatedMeals = [...selectedMeals, meal];
    console.log("Updated Meals:", updatedMeals);

  setSelectedMeals(updatedMeals);

  localStorage.setItem(
    mealsKey,
    JSON.stringify(updatedMeals)
  );
};
// delete items
const removeMealFromToday = (meal: any) => {
  const updatedMeals = selectedMeals.filter(
    (m) => m.name !== meal.name
  );
  setMessage({
    text : t("mealRemoved" , language),
    type :"error"
  });
    setTimeout(() => {    
      setMessage(null);}, 2000);

  setSelectedMeals(updatedMeals);
  localStorage.setItem(
    mealsKey,
    JSON.stringify(updatedMeals)
  );
};

  // Get personalized calorie targets from onboarding
  const dailyCalorieGoal = parseInt(localStorage.getItem('dailyCalorieGoal') || '2000');
  const fitnessGoal = localStorage.getItem('userFitnessGoal') || 'stayFit';
  
  // Calculate meal distribution based on total calorie goal
  const breakfastTarget = Math.round(dailyCalorieGoal * 0.25); // 25% for breakfast
  const lunchTarget = Math.round(dailyCalorieGoal * 0.35); // 35% for lunch
  const dinnerTarget = Math.round(dailyCalorieGoal * 0.30); // 30% for dinner
  // 10% left for snacks
  // breakfast dynamic
  const breakfastMeals = JSON.parse(
  localStorage.getItem(
    `breakfastMeals_${userEmail}_${selectedDate}`
  ) || "[]"
);
console.log("BREAKFAST MEALS", breakfastMeals);
console.log("BREAKFAST COUNT", breakfastMeals.length);
const breakfastCalories =breakfastMeals.reduce((sum: number, meal: any) =>sum + meal.calories,0);
console.log("BREAKFAST CALS", breakfastCalories);
//lunch dynamic
  const lunchMeals = JSON.parse(
  localStorage.getItem(
    `lunchMeals_${userEmail}_${selectedDate}`
  ) || "[]"
);

  const lunchCalories =lunchMeals.reduce((sum: number, meal: any) =>sum + meal.calories,0);
// dinner dynamic 
 const dinnerMeals = JSON.parse(
  localStorage.getItem(
    `dinnerMeals_${userEmail}_${selectedDate}`
  ) || "[]"
);
  const dinnerCalories =dinnerMeals.reduce((sum: number, meal: any) =>sum + meal.calories,0);

// dynamic ingreduants
  const getMacros = (meals: any[]) => ({protein: meals.reduce((sum, meal) => sum + (meal.protein || 0),0),
    carbs: meals.reduce((sum, meal) => sum + (meal.carbs || 0),0),
    fats: meals.reduce((sum, meal) => sum + (meal.fats || 0),0),
  });
const breakfastMacros =
  getMacros(breakfastMeals);
const lunchMacros =
  getMacros(lunchMeals);
const dinnerMacros =
  getMacros(dinnerMeals);

// total p , c, f
const totalProtein =
  breakfastMacros.protein +
  lunchMacros.protein +
  dinnerMacros.protein;

const totalCarbs =
  breakfastMacros.carbs +
  lunchMacros.carbs +
  dinnerMacros.carbs;

const totalFats =
  breakfastMacros.fats +
  lunchMacros.fats +
  dinnerMacros.fats;

  console.log({
  breakfastMeals,
  lunchMeals,
  dinnerMeals
});
const mealCategories = [
    {
      type: 'breakfast',
      name: t('breakfast', language),
      currentCalories: breakfastCalories,
      targetCalories: breakfastTarget,
      macros: breakfastMacros,
      color: 'from-amber-400 to-orange-400',
      mealCount: breakfastMeals.length,
    },
    {
      type: 'lunch',
      name: t('lunch', language),
      currentCalories: lunchCalories,
      targetCalories: lunchTarget,
      macros: lunchMacros,
      color: 'from-sky-400 to-blue-400',
      mealCount: lunchMeals.length,
    },
    {
      type: 'dinner',
      name: t('dinner', language),
      currentCalories: dinnerCalories,
      targetCalories: dinnerTarget,
      macros: dinnerMacros,
      color: 'from-purple-400 to-pink-400',
      mealCount: dinnerMeals.length,
    },
  ];

const totalCalories =
  breakfastCalories +
  lunchCalories +
  dinnerCalories;
const targetCalories = dailyCalorieGoal;
  
  // Personalized message based on fitness goal
  const getGoalMessage = () => {
    if (language === 'en') {
      if (fitnessGoal === 'weightLoss') return 'Track calories to stay in deficit for weight loss';
      if (fitnessGoal === 'muscleGain') return 'Fuel your muscles with adequate protein and calories';
      if (fitnessGoal === 'stayFit') return 'Maintain balanced nutrition for optimal health';
      return 'Track your nutrition to achieve your goals';
    } else {
      if (fitnessGoal === 'weightLoss') return 'تتبع السعرات للبقاء في عجز لفقدان الوزن';
      if (fitnessGoal === 'muscleGain') return 'زود عضلاتك بالبروتين والسعرات الكافية';
      if (fitnessGoal === 'stayFit') return 'حافظ على تغذية متوازنة للصحة المثلى';
      return 'تتبع تغذيتك لتحقيق أهدافك';
    }
  };
        const allMeals = [
        ...breakfastMeals,
        ...lunchMeals,
        ...dinnerMeals,
        ];
      const downloadReport = () => {
      const pdf = new jsPDF();
          pdf.setFontSize(18);
          pdf.text("Daily Meals Report", 20, 20);
          pdf.setFontSize(12);
          pdf.text(`Date: ${selectedDate}`, 20, 35);

        pdf.text(`Breakfast Calories: ${breakfastCalories}`,20,45);

        pdf.text(`Lunch Calories: ${lunchCalories}`,20,55);

        pdf.text(`Dinner Calories: ${dinnerCalories}`,20,65);

        pdf.text(`Total Calories: ${totalCalories}`,20,75);
      let y = 95;
          allMeals.forEach((meal, index) => {
            pdf.text(
            `${index + 1}. ${meal.name} - ${meal.calories} kcal`,20,y
            );
            y += 10;
  });
          pdf.save(`Meals_Report_${selectedDate}.pdf`);
};
useEffect(() => {
  const savedMeals = JSON.parse(
    localStorage.getItem(mealsKey) || "[]"
  );
  setSelectedMeals(savedMeals);
}, [mealsKey]);
// bord become color
const remainingCalories =
  targetCalories - totalCalories;

const isGoalReached =
  totalCalories >= targetCalories;


const addRecommendedMeal = (mealType: string) => {
  const key =
`${mealType}Meals_${userEmail}_${selectedDate}`;

  const savedMeals = JSON.parse(
    localStorage.getItem(key) || "[]"
  );

  const updatedMeals = [
    ...savedMeals,
    {
      ...selectedMeal,
      id: Date.now(),
    },
  ];
console.log("SELECTED DATE", selectedDate);
console.log("KEY", key);
 localStorage.setItem(
  key,
  JSON.stringify(updatedMeals)
);

setIsMealTypeOpen(false);

setMessage({
  text: `${selectedMeal.name} - ${t(
    "mealAddedSuccessfully",
    language
  )}`,
  type: "success",
});

  setTimeout(() => {
    setMessage(null);
  }, 2000);
};
useEffect(() => {
  localStorage.setItem(
    "selectedDate",
    selectedDate
  );
}, [selectedDate]);
console.log(
  `breakfastMeals_${userEmail}_${selectedDate}`
);
  return (
    <div className="min-h-screen p-4 md:p-8 bg-background transition-colors duration-300">
      {message && (
      <div className={`fixed top-5 right-5 w-100 m-auto z-50 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg
      ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}
    >
        {message.text}
      </div>
)}
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-sky-900 dark:text-sky-100 mb-2">{t('yourMeals', language)}</h1>
            <p className="text-sky-600 dark:text-sky-400">{getGoalMessage()}</p>
          </div>
          <div className="flex items-center gap-3">
              {/* Date Picker */} 
              <div className="flex items-center gap-3"> 
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-card border border-sky-200 dark:border-gray-700 shadow-sm"> 
                  <Calendar className="w-5 h-5 text-sky-600 dark:text-sky-400" /> 
                  <input type="date" value={selectedDate} onChange={handleDateChange} className="bg-transparent outline-none text-sky-700 dark:text-sky-300" />
                </div> 
              </div>
          </div>
        </div>

        {/* Daily Summary Card - Personalized */}
        <div className="bg-gradient-to-r from-sky-100 to-mint-100 dark:from-sky-900/40 dark:to-mint-900/40 rounded-3xl p-6 shadow-sm border border-sky-200/50 dark:border-sky-800/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sky-700 dark:text-sky-300 mb-1">{language === 'en' ? 'Total Calories Today' : 'إجمالي السعرات اليوم'}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl text-sky-900 dark:text-sky-100 font-bold">{totalCalories}</span>
                <span className="text-sky-600 dark:text-sky-400">/ {targetCalories} {t('kcal', language)}</span>
              </div>
              <p className="text-xs text-sky-600 dark:text-sky-400 mt-1">
                {language === 'en' ? `${targetCalories - totalCalories} calories remaining` : `${targetCalories - totalCalories} سعرة متبقية`}
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/60 dark:bg-gray-800/60 flex items-center justify-center shadow-sm">
              <TrendingUp onClick={downloadReport} className="w-8 h-8 text-sky-600 dark:text-sky-400" />
            </div>
          </div>
          <div className="w-full bg-white/40 dark:bg-gray-700/40 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-sky-500 to-mint-500 h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${Math.min((totalCalories / targetCalories) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Predefined Meals Section */}
    <PredefinedMeals addMealToToday={openMealSelector} selectedMeals={selectedMeals} removeMealFromToday={removeMealFromToday}/>
          
            <div className="mt-4 text-center">
                {isGoalReached ? (
                  <p className="text-green-600 font-semibold">
                    🎉 Goal Achieved
                  </p>) : (
                  <p className="text-orange-500 font-semibold">🔥 {remainingCalories} kcal remaining</p>
                  )}
            </div>

{/* Main Meal Categories Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sky-900 dark:text-sky-100">{t('mealCategories', language)}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mealCategories.map((meal) => (
            <MealCategoryCard key={meal.type} meal={meal} />
          ))}
        </div>
      </div>
{isMealTypeOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-3xl p-6 w-80">

      <h3>
          {t("selectMealType", language)}
      </h3>

      <div className="flex flex-col gap-3">

        <button
          onClick={() =>
            addRecommendedMeal("breakfast")
          }
          className="p-3 rounded-xl bg-orange-100"
        >
          🥞 {t("breakfast", language)}
        </button>

        <button
          onClick={() =>
            addRecommendedMeal("lunch")
          }
          className="p-3 rounded-xl bg-sky-100"
        >
          🍛 {t("lunch", language)}
        </button>

        <button
          onClick={() =>
            addRecommendedMeal("dinner")
          }
          className="p-3 rounded-xl bg-purple-100"
        >
          🌙 {t("dinner", language)}
        </button>

      </div>
    </div>
  </div>
)}
      {/* Nearby Restaurants Section */}
      <NearbyRestaurants />
    </div>
  );
}