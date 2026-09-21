import { CheckCircle, ArrowRight, Activity, Flame, TrendingUp } from 'lucide-react';

interface FoodAnalysisResultProps {
  analysis: {
    foodName: string;
    servingSize: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber?: number;
    healthScore: number;
    healthAnalysis: string;
    ingredients?: string[];
    recommendations?: string;
  };
  onUseData: () => void;
}

export function FoodAnalysisResult({ analysis, onUseData }: FoodAnalysisResultProps) {
  const getHealthScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 75) return 'Excellent';
    if (score >= 50) return 'Good';
    return 'Moderate';
  };

  return (
    <div className="bg-gradient-to-br from-sky-50 to-white rounded-2xl p-6 border border-sky-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl text-sky-900 mb-1">{analysis.foodName}</h3>
          <p className="text-sm text-sky-600">{analysis.servingSize}</p>
        </div>
        <div className={`px-3 py-1 rounded-xl ${getHealthScoreColor(analysis.healthScore)}`}>
          <p className="text-sm">{getHealthScoreLabel(analysis.healthScore)}</p>
        </div>
      </div>

      {/* Nutritional Macros Grid */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
          <p className="text-lg text-sky-900">{analysis.calories}</p>
          <p className="text-xs text-sky-600">Cal</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <Activity className="w-5 h-5 text-red-500 mx-auto mb-1" />
          <p className="text-lg text-sky-900">{analysis.protein}g</p>
          <p className="text-xs text-sky-600">Protein</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <TrendingUp className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className="text-lg text-sky-900">{analysis.carbs}g</p>
          <p className="text-xs text-sky-600">Carbs</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <div className="w-5 h-5 rounded-full bg-yellow-500 mx-auto mb-1"></div>
          <p className="text-lg text-sky-900">{analysis.fats}g</p>
          <p className="text-xs text-sky-600">Fats</p>
        </div>
      </div>

      {/* Health Analysis */}
      <div className="bg-white rounded-xl p-4 mb-4">
        <h4 className="text-sm text-sky-700 mb-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Health Analysis
        </h4>
        <p className="text-sm text-sky-900 leading-relaxed">{analysis.healthAnalysis}</p>
      </div>

      {/* Ingredients (if available) */}
      {analysis.ingredients && analysis.ingredients.length > 0 && (
        <div className="bg-white rounded-xl p-4 mb-4">
          <h4 className="text-sm text-sky-700 mb-2">Main Ingredients</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-xl bg-sky-50 text-sm text-sky-700"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations (if available) */}
      {analysis.recommendations && (
        <div className="bg-mint-50 rounded-xl p-4 mb-4">
          <h4 className="text-sm text-mint-700 mb-2">💡 Recommendation</h4>
          <p className="text-sm text-mint-900">{analysis.recommendations}</p>
        </div>
      )}

      {/* Use Data Button */}
      <button
        onClick={onUseData}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-sm"
      >
        <span>Use This Data</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
