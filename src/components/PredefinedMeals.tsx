import { Plus, Flame , Check } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useRef, useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { t } from '../utils/translations';

export function PredefinedMeals({
  addMealToToday ,selectedMeals ,removeMealFromToday,
}: {
  addMealToToday: (meal: any) => void;
  removeMealFromToday: (meal: any) => void;
  selectedMeals: any[]
}) {
  const { language } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);

  // Mock API data for predefined meals
  const [predefinedMeals, setPredefinedMeals] = useState<any[]>([]);

const getRecommendedMeals = async () => {
try {
  const token = localStorage.getItem("token");

            console.log("TOKEN:", token);

  const response = await fetch(
                  "http://balancelifeapp.runasp.net/api/Meals?isRecommended=true",
                  {
                    method: "GET",
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    }
                  }
  );
console.log("Status:", response.status);
if (!response.ok) {
  throw new Error(`HTTP Error: ${response.status}`);
}

const data = await response.json();
console.log(data);
setPredefinedMeals(data.data);
}
catch (error) {
console.error("Error fetching meals:", error);
}
};
useEffect(() => {
getRecommendedMeals();
}, []);


  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sky-900">{t("recommendedMeals" , language)}</h2>
        {predefinedMeals.length > 3 && (
  <button
    onClick={() => setShowAll(!showAll)}
    className="text-sky-600 hover:text-sky-700 transition-colors"
  >
    {showAll ? "Show Less" : "View All"}
  </button>
)}
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(showAll
  ? predefinedMeals
  : predefinedMeals.slice(0, 6)
).map((meal) => (
          <MealCard key={meal.id} meal={meal} addMealToToday={addMealToToday} removeMealFromToday={removeMealFromToday} selectedMeals={selectedMeals}/>
        ))}
      </div>

      {/* Mobile: Horizontal Scroll */}
      <div className="md:hidden overflow-x-auto -mx-4 px-4" ref={scrollRef}>
        <div className="flex gap-4 pb-4">
          {(showAll
  ? predefinedMeals
  : predefinedMeals.slice(0, 6)
).map((meal) => (
            <div key={meal.id} className="flex-shrink-0 w-72">
              <MealCard meal={meal} addMealToToday={addMealToToday} removeMealFromToday={removeMealFromToday} selectedMeals={selectedMeals} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MealCard({
  meal,
  addMealToToday,
  selectedMeals,
  removeMealFromToday,
}: {
  meal: any;
  addMealToToday: (meal: any) => void;
  removeMealFromToday: (meal: any) => void;
  selectedMeals: any[];
}) {
console.log(meal);
  const isAdded = selectedMeals.some(
    (m) => m.name === meal.name
  );
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={meal.pictureUrl}
          alt={meal.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
<button
  onClick={() =>
    isAdded
      ? removeMealFromToday(meal)
      : addMealToToday(meal)
  }
  className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center"
>
  {isAdded ? (
    <Check className="w-5 h-5 text-green-600" />
  ) : (
    <Plus className="w-5 h-5 text-sky-600" />
  )}
</button>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-sky-900 mb-3">{meal.name}</h3>
        
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-sky-100">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-50 to-red-50">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-orange-700">{meal.calories} kcal</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-sm text-sky-600 mb-1">Protein</p>
            <p className="text-sky-900 text-xs">{meal.protein}g</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-sky-600 mb-1">Carbs</p>
            <p className="text-sky-900 text-xs">{meal.carbs}g</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-sky-600 mb-1">Fats</p>
            <p className="text-sky-900 text-xs">{meal.fats}g</p>
          </div>
        </div>
      </div>
    </div>
  );
}
