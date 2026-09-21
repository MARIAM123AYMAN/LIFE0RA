import { useEffect, useState } from 'react';
import jsPDF from "jspdf";
import { Calendar, Trash2, TrendingUp } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t } from '../utils/translations';
import { PredefinedMeals } from './PredefinedMeals';
import { MealCategoryCard } from './MealCategoryCard';
import { NearbyRestaurants } from './NearbyRestaurants';

const userName = localStorage.getItem("userName") || "User";

export function MealsOverview() {
  const { language, selectedDate, setSelectedDate } = useApp();
  const userEmail = localStorage.getItem("userEmail");
  
  const [message, setMessage] = useState<{ text: string; type: "success" | "error"; } | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<any[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [isMealTypeOpen, setIsMealTypeOpen] = useState(false);

  // Define local storage tracking key for predefined selected meals
  const mealsKey = `selectedMeals_${userEmail}_${selectedDate}`;

  // Handle date synchronization from the datepicker component
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    localStorage.setItem("dashboardDate", e.target.value);
  };

  // Trigger modal overlay to choose a category slot for a recommended meal
  const openMealSelector = (meal: any) => {
    setSelectedMeal(meal);
    setIsMealTypeOpen(true);
  };

  // Add meal item directly to selection list
  const addMealToToday = (meal: any) => {
    setMessage({
      text: t("mealAdded", language),
      type: "success",
    });
    setTimeout(() => { setMessage(null); }, 2000);

    console.log("Clicked Meal:", meal);
    console.log("Current Meal ID:", meal.id);
    console.log(selectedMeals.map((m) => ({ id: m.id, name: m.name })));

    const exists = selectedMeals.some((m) => m.name === meal.name);
    console.log("Exists:", exists);
    if (exists) return;

    const updatedMeals = [...selectedMeals, meal];
    console.log("Updated Meals:", updatedMeals);

    setSelectedMeals(updatedMeals);
    localStorage.setItem(mealsKey, JSON.stringify(updatedMeals));
  };

  // Remove meal item from the daily temporary selection array
  const removeMealFromToday = (meal: any) => {
    const updatedMeals = selectedMeals.filter((m) => m.name !== meal.name);
    setMessage({
      text: t("mealRemoved", language),
      type: "error"
    });
    setTimeout(() => { setMessage(null); }, 2000);

    setSelectedMeals(updatedMeals);
    localStorage.setItem(mealsKey, JSON.stringify(updatedMeals));
  };

  // Extract baseline targets saved during the user onboarding step
  const dailyCalorieGoal = parseInt(localStorage.getItem('dailyCalorieGoal') || '2000');
  const fitnessGoal = localStorage.getItem('userFitnessGoal') || 'stayFit';

  // Distribute general calorie boundaries per traditional meal split ratios
  const breakfastTarget = Math.round(dailyCalorieGoal * 0.25); // 25% allocation
  const lunchTarget = Math.round(dailyCalorieGoal * 0.35);     // 35% allocation
  const dinnerTarget = Math.round(dailyCalorieGoal * 0.30);    // 30% allocation

  // Dynamically load active breakfast array and compute accumulated totals
  const breakfastMeals = JSON.parse(localStorage.getItem(`breakfastMeals_${userEmail}_${selectedDate}`) || "[]");
  console.log("BREAKFAST MEALS", breakfastMeals);
  console.log("BREAKFAST COUNT", breakfastMeals.length);
  const breakfastCalories = breakfastMeals.reduce((sum: number, meal: any) => sum + meal.calories, 0);
  console.log("BREAKFAST CALS", breakfastCalories);

  // Dynamically load active lunch array and compute accumulated totals
  const lunchMeals = JSON.parse(localStorage.getItem(`lunchMeals_${userEmail}_${selectedDate}`) || "[]");
  const lunchCalories = lunchMeals.reduce((sum: number, meal: any) => sum + meal.calories, 0);

  // Dynamically load active dinner array and compute accumulated totals
  const dinnerMeals = JSON.parse(localStorage.getItem(`dinnerMeals_${userEmail}_${selectedDate}`) || "[]");
  const dinnerCalories = dinnerMeals.reduce((sum: number, meal: any) => sum + meal.calories, 0);

  // Accumulate total baseline macros from a designated array collection
  const getMacros = (meals: any[]) => ({
    protein: meals.reduce((sum, meal) => sum + (meal.protein || 0), 0),
    carbs: meals.reduce((sum, meal) => sum + (meal.carbs || 0), 0),
    fats: meals.reduce((sum, meal) => sum + (meal.fats || 0), 0),
  });

  const breakfastMacros = getMacros(breakfastMeals);
  const lunchMacros = getMacros(lunchMeals);
  const dinnerMacros = getMacros(dinnerMeals);

  // Sum up combined macro counts for daily chart references
  const totalProtein = breakfastMacros.protein + lunchMacros.protein + dinnerMacros.protein;
  const totalCarbs = breakfastMacros.carbs + lunchMacros.carbs + dinnerMacros.carbs;
  const totalFats = breakfastMacros.fats + lunchMacros.fats + dinnerMacros.fats;

  console.log({ breakfastMeals, lunchMeals, dinnerMeals });

  // Array mapping for structured visualization profiles across components
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

  const totalCalories = breakfastCalories + lunchCalories + dinnerCalories;
  const targetCalories = dailyCalorieGoal;

  // Render contextual supportive tips mapped to primary targets
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

  const allMeals = [...breakfastMeals, ...lunchMeals, ...dinnerMeals];
  const remainingCalories = targetCalories - totalCalories;
  const isGoalReached = totalCalories >= targetCalories;

  // Build and print a downloadable client PDF report document
  const downloadReport = () => {
    const pdf = new jsPDF();

    // Top Brand Accent Header styling Block
    pdf.setFillColor(14, 165, 233);
    pdf.rect(0, 0, 210, 30, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text("Balance Life", 20, 15);

    pdf.setFontSize(13);
    pdf.text("Daily Nutrition Report", 20, 24);

    // Profile Metadata Rows
    pdf.setTextColor(0);
    pdf.setFontSize(12);
    pdf.text(`User: ${userName}`, 20, 42);
    pdf.text(`Date: ${selectedDate}`, 20, 50);

    // Border Frame for consolidated values display
    pdf.setDrawColor(14, 165, 233);
    pdf.roundedRect(15, 58, 180, 40, 3, 3);

    pdf.setFontSize(15);
    pdf.text("Daily Summary", 20, 70);

    pdf.setFontSize(11);
    pdf.text(`Breakfast : ${breakfastCalories} kcal`, 20, 80);
    pdf.text(`Lunch : ${lunchCalories} kcal`, 20, 87);
    pdf.text(`Dinner : ${dinnerCalories} kcal`, 20, 94);

    pdf.setFontSize(12);
    pdf.text(`Total Calories : ${totalCalories} kcal`, 120, 80);
    pdf.text(`Goal : ${targetCalories} kcal`, 120, 87);
    pdf.text(`Remaining : ${remainingCalories} kcal`, 120, 94);

    // Dynamic list indexing for printed meals
    let y = 115;
    pdf.setFontSize(16);
    pdf.text("Meals", 20, y);
    y += 10;

    allMeals.forEach((meal, index) => {
      pdf.setFontSize(11);
      pdf.text(`${index + 1}. ${meal.name}`, 20, y);
      pdf.text(`${meal.calories} kcal`, 160, y);
      y += 8;
    });

    // Total consolidated macronutrients breakdown text block
    y += 10;
    pdf.setFontSize(15);
    pdf.text("Nutrition", 20, y);
    y += 10;

    pdf.setFontSize(11);
    pdf.text(`Protein : ${totalProtein} g`, 20, y);
    y += 8;
    pdf.text(`Carbs : ${totalCarbs} g`, 20, y);
    y += 8;
    pdf.text(`Fats : ${totalFats} g`, 20, y);

    // Conditional target color coding for validation feedback
    y += 18;
    if (isGoalReached) {
      pdf.setTextColor(0, 150, 0);
      pdf.setFontSize(13);
      pdf.text("Goal Achieved", 20, y);
    } else {
      pdf.setTextColor(255, 120, 0);
      pdf.setFontSize(13);
      pdf.text(`${remainingCalories} kcal remaining`, 20, y);
    }

    // Centered base footer credit mark
    pdf.setTextColor(120);
    pdf.setFontSize(10);
    pdf.text("Generated by Balance Life", 20, 285);

    pdf.save(`Meals_Report_${selectedDate}.pdf`);
  };

  // Sync selected array dataset when the primary lookup key changes
  useEffect(() => {
    const savedMeals = JSON.parse(localStorage.getItem(mealsKey) || "[]");
    setSelectedMeals(savedMeals);
  }, [mealsKey]);

  // Append chosen option from predefined list directly into targeted meal context array
  const addRecommendedMeal = (mealType: string) => {
    const key = `${mealType}Meals_${userEmail}_${selectedDate}`;
    const savedMeals = JSON.parse(localStorage.getItem(key) || "[]");

    const updatedMeals = [
      ...savedMeals,
      {
        ...selectedMeal,
        id: Date.now(),
      },
    ];

    console.log("SELECTED DATE", selectedDate);
    console.log("KEY", key);
    localStorage.setItem(key, JSON.stringify(updatedMeals));
    setIsMealTypeOpen(false);

    setMessage({
      text: `${selectedMeal.name} - ${t("mealAddedSuccessfully", language)}`,
      type: "success",
    });

    setTimeout(() => { setMessage(null); }, 2000);
  };

  // Persist selected date parameter across page reloads
  useEffect(() => {
    localStorage.setItem("selectedDate", selectedDate);
  }, [selectedDate]);

  console.log(`breakfastMeals_${userEmail}_${selectedDate}`);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background transition-colors duration-300">
      {/* Alert Notification Display Toast */}
      {message && (
        <div className={`fixed top-5 right-5 w-100 m-auto z-50 text-white px-4 py-2 rounded-xl shadow-lg ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {message.text}
        </div>
      )}

      {/* Primary Row Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-sky-900 dark:text-sky-100 mb-2">{t('yourMeals', language)}</h1>
            <p className="text-sky-600 dark:text-sky-400">{getGoalMessage()}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-card border border-sky-200 dark:border-gray-700 shadow-sm">
              <Calendar className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="bg-transparent outline-none text-sky-700 dark:text-sky-300"
              />
            </div>
          </div>
        </div>

        {/* Daily Progression Tracker Widget Card */}
        <div className="bg-gradient-to-r from-sky-100 to-mint-100 dark:from-sky-900/40 dark:to-mint-900/40 rounded-3xl p-6 shadow-sm border border-sky-200/50 dark:border-sky-800/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sky-700 dark:text-sky-300 mb-1">
                {language === 'en' ? 'Total Calories Today' : 'إجمالي السعرات اليوم'}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl text-sky-900 dark:text-sky-100 font-bold">{totalCalories}</span>
                <span className="text-sky-600 dark:text-sky-400">/ {targetCalories} {t('kcal', language)}</span>
              </div>
              <p className="text-xs text-sky-600 dark:text-sky-400 mt-1">
                {language === 'en' ? `${targetCalories - totalCalories} calories remaining` : `${targetCalories - totalCalories} سعرة متبقية`}
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/60 dark:bg-gray-800/60 flex items-center justify-center shadow-sm cursor-pointer">
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

      {/* Predefined Food Option Carousel / Picker */}
      <PredefinedMeals
        addMealToToday={openMealSelector}
        selectedMeals={selectedMeals}
        removeMealFromToday={removeMealFromToday}
      />

      {/* Visual Feedback Message regarding current remaining values */}
      <div className="mt-4 text-center">
        {isGoalReached ? (
          <p className="text-green-600 font-semibold">🎉 Goal Achieved</p>
        ) : (
          <p className="text-orange-500 font-semibold">🔥 {remainingCalories} kcal remaining</p>
        )}
      </div>

      {/* Main Structuring Grid layout section */}
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

      {/* Selection Pop Modal for specific assignment target slots */}
      {isMealTypeOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-80">
            <h3 className="mb-4 font-bold text-sky-900">{t("selectMealType", language)}</h3>
            <div className="flex flex-col gap-3">
              <button onClick={() => addRecommendedMeal("breakfast")} className="p-3 rounded-xl bg-orange-100 text-left hover:opacity-80 transition-opacity">
                🥞 {t("breakfast", language)}
              </button>
              <button onClick={() => addRecommendedMeal("lunch")} className="p-3 rounded-xl bg-sky-100 text-left hover:opacity-80 transition-opacity">
                🍛 {t("lunch", language)}
              </button>
              <button onClick={() => addRecommendedMeal("dinner")} className="p-3 rounded-xl bg-purple-100 text-left hover:opacity-80 transition-opacity">
                🌙 {t("dinner", language)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Maps and geolocation surrounding recommendations anchor block */}
      <NearbyRestaurants />
    </div>
  );
}