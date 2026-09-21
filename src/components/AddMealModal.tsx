import { X, Sparkles, Camera, Upload, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { analyzeMeal } from "../utils/gemini";
import { FoodAnalysisResult } from './FoodAnalysisResult';
import { analyzeMealImage } from "../utils/imageGemini";
import { useApp } from "../contexts/AppContext";
import { t } from "../utils/translations";
interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeal: (meal: any) => void;
}

export function AddMealModal({ isOpen, onClose, onAddMeal }: AddMealModalProps) {
  const { language } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
  });

  const [isAILoading, setIsAILoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'manual' | 'camera'>('manual');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMeal({
      name: formData.name,
      quantity: formData.quantity,
      calories: Number(formData.calories),
      protein: Number(formData.protein),
      carbs: Number(formData.carbs),
      fats: Number(formData.fats),
    });
    
    // Reset form
    setFormData({
      name: '',
      quantity: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
    });
    setSelectedImage(null);
    setAnalysisResult(null);
    setActiveTab('manual');
  };

  // Manual AI/API nutritional data fetch
const handleAIFetch = async () => {
  if (!formData.name || !formData.quantity) {
    alert("Please enter food name and quantity first");
    return;
  }

  try {
    setIsAILoading(true);

    const result = await analyzeMeal(
      formData.name,
      formData.quantity
    );

    setFormData((prev) => ({
      ...prev,
      calories: String(result.calories),
      protein: String(result.protein),
      carbs: String(result.carbs),
      fats: String(result.fats),
    }));
  } catch (error) {
    console.error(error);
    alert("Failed to analyze meal");
  } finally {
    setIsAILoading(false);
  }
};
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResult(null); // Reset previous analysis
      };
      reader.readAsDataURL(file);
    }
  };

  // Analyze food image with Gemini Vision API
 const handleImageAnalysis = async () => {
  if (!imageFile) {
    alert("Please upload an image first");
    return;
  }

  try {
    setIsAILoading(true);

    const result =
      await analyzeMealImage(imageFile);

    setFormData((prev) => ({
      ...prev,
      name: result.foodName || "",
      quantity: "1 serving",
      calories: String(result.calories || 0),
      protein: String(result.protein || 0),
      carbs: String(result.carbs || 0),
      fats: String(result.fats || 0),
    }));

    setActiveTab("manual");

  } catch (error) {
    console.error(error);
    alert("Failed to analyze image");
  } finally {
    setIsAILoading(false);
  }
};

  const useAnalysisData = () => {
    if (analysisResult) {
      setFormData({
        name: analysisResult.foodName || '',
        quantity: analysisResult.servingSize || '',
        calories: String(analysisResult.calories || 0),
        protein: String(analysisResult.protein || 0),
        carbs: String(analysisResult.carbs || 0),
        fats: String(analysisResult.fats || 0),
      });
      setActiveTab('manual');
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-sky-100 px-6 py-4 rounded-t-3xl z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-sky-900 dark:text-white">{t("addNewMeal", language)}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-sky-600 hover:bg-sky-50 dark:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2 px-4 rounded-xl transition-all ${
                activeTab === 'manual'
                  ? 'bg-sky-500 text-white'
                  : 'bg-sky-50 dark:bg-slate-700 text-sky-700 hover:bg-sky-100'
              }`}
            >
              {t("manualEntry", language)}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('camera')}
              className={`flex-1 py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'camera'
                  ? 'bg-sky-500 text-white'
                  : 'bg-sky-50 dark:bg-slate-700 text-sky-700 hover:bg-sky-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              {t("cameraAnalysis", language)}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'camera' ? (
            // Camera/Upload Tab
            <div className="space-y-6">
              {/* Image Upload Area */}
              <div>
                <label className="block text-sm text-sky-700 mb-3">{t("uploadFoodPhoto", language)}</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="food-image-upload"
                  />
                  <label
                    htmlFor="food-image-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-sky-300 rounded-2xl cursor-pointer hover:border-sky-400 transition-all bg-sky-50/50"
                  >
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Selected food"
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-sky-400 mb-3" />
                        <p className="text-sky-700 mb-1">{t("clickToUploadFoodImage", language)}</p>
                        <p className="text-sm text-sky-600">PNG, JPG up to 10MB</p>
                      </>
                    )}
                  </label>
                </div>

                {selectedImage && (
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="mt-2 text-sm text-sky-600 hover:text-sky-700"
                  >
                    {t("removeImage", language)}
                  </button>
                )}
              </div>

              {/* Analyze Button */}
              <button
                type="button"
                onClick={handleImageAnalysis}
                disabled={!selectedImage || isAILoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAILoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t("analyzingFood", language)}...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{t("analyzeWithAI", language)}</span>
                  </>
                )}
              </button>

              {/* Analysis Results */}
              {analysisResult && (
                <FoodAnalysisResult
                  analysis={analysisResult}
                  onUseData={useAnalysisData}
                />
              )}
            </div>
          ) : (
            // Manual Entry Tab
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Food Name */}
              <div>
                <label className="block text-sm text-sky-700 mb-2">{t("foodName", language)}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Grilled Chicken Breast"
                  className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-slate-700 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm text-sky-700 mb-2">{t("quantity", language)}</label>
                <input
                  type="text"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g., 150g or 1 cup"
                  className="w-full px-4 py-3 rounded-2xl  border border-sky-200  focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                />
              </div>

              {/* AI Fetch Button */}
              <button
                type="button"
                onClick={handleAIFetch}
                disabled={isAILoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-5 h-5 ${isAILoading ? 'animate-spin' : ''}`} />
                <span>{isAILoading ? 'fetching...' : 'get Nutrition From Ai'}</span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-sky-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-slate-800 px-3 text-xs text-sky-600">{t("orEnterManually", language)}</span>
                </div>
              </div>

              {/* Nutrition Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-sky-700 mb-2">{t("calories", language)} (kcal)</label>
                  <input
                    type="number"
                    required
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    placeholder="250"
                    className="w-full px-4 py-3 rounded-2xl border border-sky-200   focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-sky-700 mb-2">{t("protein", language)} (g)</label>
                  <input
                    type="number"
                    required
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                    placeholder="15"
                    className="w-full px-4 py-3 rounded-2xl border border-sky-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-sky-700 mb-2">{t("carbs", language)} (g)</label>
                  <input
                    type="number"
                    required
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                    placeholder="30"
                    className="w-full px-4 py-3 rounded-2xl border border-sky-200 dark:border-slate-700 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-sky-700 mb-2">{t("fats", language)} (g)</label>
                  <input
                    type="number"
                    required
                    value={formData.fats}
                    onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                    placeholder="8"
                    className="w-full px-4 py-3 rounded-2xl border border-sky-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-2xl border border-sky-200  text-sky-700 hover:bg-sky-50 dark:bg-slate-700 transition-all"
                >
                  {t("cancel", language)}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-mint-500 text-white hover:from-sky-600 hover:to-mint-600 transition-all shadow-sm"
                >
                  {t("addMealBtn", language)}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
