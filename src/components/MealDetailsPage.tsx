import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Coffee, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AddMealModal } from './AddMealModal';
import { NutritionCharts } from './NutritionCharts';
import { notifications } from '../utils/notifications';
import { useApp } from '../contexts/AppContext';
import { t } from '../utils/translations';

export function MealDetailsPage() {
  const { language } = useApp();
  const { mealType } = useParams();
  const userEmail = localStorage.getItem("userEmail");

  // Retrieve selected date with fallback to today's date string
  const [selectedDate, setSelectedDate] = useState(
    localStorage.getItem("selectedDate") || new Date().toISOString().split("T")[0]
  );

  // Define unique composite key for current user, meal type, and date
  const mealsKey = `${mealType}Meals_${userEmail}_${selectedDate}`;

  console.log("DETAILS KEY:", mealsKey);
  console.log("DETAILS DATA:", localStorage.getItem(mealsKey));
  console.log("DATE =", selectedDate);
  console.log("KEY =", mealsKey);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meals, setMeals] = useState<any[]>([]);

  // Get specific meal settings dynamically based on route params
  const getMealInfo = (type: string | undefined) => {
    switch (type) {
      case 'breakfast':
        return {
          name: t('breakfast', language),
          icon: Coffee,
          color: 'from-amber-400 to-orange-400',
          target: 500,
        };
      case 'lunch':
        return { 
          name: 'Lunch', 
          icon: Sun, 
          color: 'from-sky-400 to-blue-400', 
          target: 700 
        };
      case 'dinner':
        return { 
          name: 'Dinner', 
          icon: Moon, 
          color: 'from-purple-400 to-pink-400', 
          target: 600 
        };
      default:
        return { 
          name: 'Meal', 
          icon: Coffee, 
          color: 'from-sky-400 to-mint-400', 
          target: 600 
        };
    }
  };

  const mealInfo = getMealInfo(mealType);
  const Icon = mealInfo.icon;

  // Compute calculated nutrition accumulated values
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFats = meals.reduce((sum, meal) => sum + meal.fats, 0);

  // Recalculate global daily calories across all meals
  const updateDailyCalories = () => {
    const breakfast = JSON.parse(localStorage.getItem(`breakfastMeals_${userEmail}_${selectedDate}`) || "[]");
    const lunch = JSON.parse(localStorage.getItem(`lunchMeals_${userEmail}_${selectedDate}`) || "[]");
    const dinner = JSON.parse(localStorage.getItem(`dinnerMeals_${userEmail}_${selectedDate}`) || "[]");

    const computedTotal = [...breakfast, ...lunch, ...dinner].reduce(
      (sum, meal) => sum + meal.calories,
      0
    );

    localStorage.setItem("dailyCalories", computedTotal.toString());
  };

  // Triggered handler when saving a new meal item
  const handleAddMeal = (newMeal: any) => {
    const updatedMeals = [...meals, { ...newMeal, id: Date.now() }];
    setMeals(updatedMeals);
    
    console.log("DETAIL SAVE KEY =", mealsKey);
    localStorage.setItem(mealsKey, JSON.stringify(updatedMeals));
    setIsModalOpen(false);
    
    // Fire user push notifications alert
    notifications.mealAdded(newMeal.name, newMeal.calories);
    
    // Sync total counts to parent keys
    updateDailyCalories();
  };

  // Triggered handler when deleting a meal record item
  const handleDeleteMeal = (mealId: number) => {
    const mealToDelete = meals.find((m) => m.id === mealId);
    const updatedMeals = meals.filter((meal) => meal.id !== mealId);
    
    setMeals(updatedMeals);
    localStorage.setItem(mealsKey, JSON.stringify(updatedMeals));
    
    if (mealToDelete) {
      notifications.mealDeleted(mealToDelete.name);
    }

    // Sync total counts to parent keys
    updateDailyCalories();
  };

  // Fetch contextual raw local data sync upon component layout mounting
  useEffect(() => {
    const savedMeals = JSON.parse(localStorage.getItem(mealsKey) || "[]");
    setMeals(savedMeals);
  }, [mealsKey]);

  // Construct structured dataset format map array for analytic tracking maps
  const timelineData = meals.map((meal) => ({
    meal: meal.name,
    calories: meal.calories,
  }));

  console.log(mealsKey);
  console.log("DETAILS DATE", localStorage.getItem("selectedDate"));

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background">
      {/* Header Navigation Link & Meta Row */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t("backToMeals", language)}</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${mealInfo.color} flex items-center justify-center shadow-sm`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-sky-900 mb-1">{mealInfo.name} Details</h1>
              <p className="text-sky-600">
                {totalCalories} / {mealInfo.target} kcal
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-mint-500 text-white hover:from-sky-600 hover:to-mint-600 transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>{t("addMeal", language)}</span>
          </button>
        </div>

        {/* Macros and Progress Grid Summary Card */}
        <div className="mt-6 bg-gradient-to-r from-sky-100 to-mint-100 rounded-3xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-sky-700 mb-2">Calories</p>
              <p className="text-2xl text-sky-900">{totalCalories}</p>
              <p className="text-xs text-sky-600">kcal</p>
            </div>
            <div>
              <p className="text-xs text-sky-700 mb-2">Protein</p>
              <p className="text-2xl text-sky-900">{Number(totalProtein.toFixed(1))}</p>
              <p className="text-xs text-sky-600">grams</p>
            </div>
            <div>
              <p className="text-xs text-sky-700 mb-2">Carbs</p>
              <p className="text-2xl text-sky-900">{Number(totalCarbs.toFixed(1))}</p>
              <p className="text-xs text-sky-600">grams</p>
            </div>
            <div>
              <p className="text-xs text-sky-700 mb-2">Fats</p>
              <p className="text-2xl text-sky-900">{Number(totalFats.toFixed(1))}</p>
              <p className="text-xs text-sky-600">grams</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Split Zone: Meals List View vs Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Added Eaten Meals List */}
        <div>
          <h2 className="text-sky-900 mb-4">{t("eatenMeals", language)}</h2>
          <div className="space-y-3">
            {meals.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
                <p className="text-sky-600">{t("noMealsAdded", language)}</p>
              </div>
            ) : (
              meals.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-sky-900 mb-1">{meal.name}</h3>
                      <p className="text-sm text-sky-600">{meal.quantity}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center p-3 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50">
                      <p className="text-xs text-orange-700 mb-1">Calories</p>
                      <p className="text-orange-900">{meal.calories}</p>
                    </div>
                    <div className="text-center p-3 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50">
                      <p className="text-xs text-sky-700 mb-1">Protein</p>
                      <p className="text-sky-900">{Number(meal.protein?.toFixed?.(1) ?? meal.protein)}g</p>
                    </div>
                    <div className="text-center p-3 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50">
                      <p className="text-xs text-green-700 mb-1">Carbs</p>
                      <p className="text-green-900">{Number(meal.carbs?.toFixed?.(1) ?? meal.carbs)}g</p>
                    </div>
                    <div className="text-center p-3 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50">
                      <p className="text-xs text-purple-700 mb-1">Fats</p>
                      <p className="text-purple-900">{Number(meal.fats?.toFixed?.(1) ?? meal.fats)}g</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Graphical Representation Statistics Component */}
        <NutritionCharts
          totalCalories={totalCalories}
          targetCalories={mealInfo.target}
          protein={totalProtein}
          carbs={totalCarbs}
          fats={totalFats}
          timelineData={timelineData}
        />
      </div>

      {/* Structured Item Modal View Pop */}
      <AddMealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMeal={handleAddMeal}
      />
    </div>
  );
}