import { Link } from 'react-router-dom';
import { ArrowRight, Coffee, Sun, Moon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t } from '../utils/translations';
interface MealCategoryCardProps {
  meal: {
    type: string;
    name: string;
    currentCalories: number;
    targetCalories: number;
    macros: { protein: number; carbs: number; fats: number };
    color: string;
    mealCount: number;
  };
}

export function MealCategoryCard({ meal }: MealCategoryCardProps) {
  const { language } = useApp();
  const percentage = (meal.currentCalories / meal.targetCalories) * 100;

  const getIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return Coffee;
      case 'lunch':
        return Sun;
      case 'dinner':
        return Moon;
      default:
        return Coffee;
    }
  };


  const Icon = getIcon(meal.type);
console.log("CARD DATA", meal);
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
      {/* Header with Icon */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${meal.color} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sky-900">{meal.name}</h3>
            <p className="text-sm text-sky-600">
                  {meal.mealCount} {t("meals", language)}
            </p>
            <p className="text-sm text-sky-600">
                  {meal.currentCalories} / {meal.targetCalories} kcal
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-sky-50 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 bg-gradient-to-r ${meal.color}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Macros Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-sky-100">
        <div>
          <p className="text-xs text-sky-600 mb-1">{t("protein", language)}</p>
          <p className="text-sky-900">{meal.macros.protein.toFixed(1)}g</p>
        </div>
        <div>
          <p className="text-xs text-sky-600 mb-1">{t("carbs", language)}</p>
          <p className="text-sky-900">{meal.macros.carbs.toFixed(1)}g</p>
        </div>
        <div>
          <p className="text-xs text-sky-600 mb-1">{t("fats" , language)}</p>
          <p className="text-sky-900">{meal.macros.fats.toFixed(1)}g</p>
        </div>
      </div>

      {/* View Details Button */}
      <Link
        to={`/meal/${meal.type}`}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-50 to-mint-50 text-sky-700 hover:from-sky-100 hover:to-mint-100 transition-all group-hover:shadow-sm"
      >
       <span>{t("viewDetails", language)}</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
