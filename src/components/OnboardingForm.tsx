import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle, User, Heart, Target, Activity, Coffee } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { translations } from '../utils/translations';
import {
  createUserProfile,
  getOnboardingResult,
} from "../services/onboardingService";
interface OnboardingData {
  // Step 1: Basic Info
  age: string;
  gender: string;
  height: string;
  weight: string;
  
  // Step 2: Health Condition
  healthCondition: string[];
  
  // Step 3: Goal
  goal: string;
  
  // Step 4: Activity Level
  activityLevel: string;
  
  // Step 5: Lifestyle
  sleepHours: string;
  waterIntake: string;
  jobType: string;
}

export function OnboardingForm() {
  const navigate = useNavigate();
  const { darkMode, language } = useApp();
  const t = translations[language].onboarding;
  const tCommon = translations[language];
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    age: '',
    gender: '',
    height: '',
    weight: '',
    healthCondition: [],
    goal: '',
    activityLevel: '',
    sleepHours: '',
    waterIntake: '',
    jobType: '',
  });
  
  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Update form data
  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Toggle health condition (multi-select)
  const toggleHealthCondition = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      healthCondition: prev.healthCondition.includes(condition)
        ? prev.healthCondition.filter(c => c !== condition)
        : [...prev.healthCondition, condition]
    }));
  };

  // Calculate personalized recommendations
  const calculateRecommendations = () => {
    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    
    // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
    let bmr = 0;
    if (formData.gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Adjust based on activity level
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };
    
    const tdee = bmr * (activityMultipliers[formData.activityLevel] || 1.2);
    
    // Adjust based on goal
    let calorieTarget = tdee;
    if (formData.goal === 'loseWeight') {
      calorieTarget = tdee - 500; // 500 calorie deficit
    } else if (formData.goal === 'gainMuscle') {
      calorieTarget = tdee + 300; // 300 calorie surplus
    }
    
    // Water goal based on weight (30-35ml per kg)
    const waterGoal = Math.round((weight * 35) / 250) * 250; // Round to nearest 250ml
    
    // Workout recommendation based on goal and health condition
    let workoutType = 'General Fitness';
    if (formData.goal === 'loseWeight') {
      workoutType = 'Cardio & HIIT';
    } else if (formData.goal === 'gainMuscle') {
      workoutType = 'Strength Training';
    } else if (formData.goal === 'reduceStress') {
      workoutType = 'Yoga & Meditation';
    } else if (formData.healthCondition.includes('jointPain')) {
      workoutType = 'Low-Impact Cardio';
    }
    
    return {
      calorieTarget: Math.round(calorieTarget),
      waterGoal,
      workoutType,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee)
    };
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
  try {
    const payload = {
      age: Number(formData.age),
      gender: formData.gender === "male" ? "Male" : "Female",
      height: Number(formData.height),
      weight: Number(formData.weight),

      goal:
        formData.goal === "loseWeight"
          ? "Lose Weight"
          : formData.goal === "gainMuscle"
          ? "Gain Muscle"
          : formData.goal === "stayActive"
          ? "Stay Active"
          : formData.goal === "improveFitness"
          ? "Improve Fitness"
          : formData.goal === "reduceStress"
          ? "Reduce Stress"
          : "Event Preparation",

      activityLevel:
        formData.activityLevel === "sedentary"
          ? "Sedentary"
          : formData.activityLevel === "light"
          ? "Light"
          : formData.activityLevel === "moderate"
          ? "Moderate"
          : formData.activityLevel === "active"
          ? "Active"
          : "Very Active",

     sleepHours:
  formData.sleepHours === "less5"
    ? 4
    : formData.sleepHours === "5to6"
    ? 6
    : formData.sleepHours === "7to8"
    ? 8
    : 9,
      waterIntake:
        formData.waterIntake === "less1L"
          ? 1
          : formData.waterIntake === "1to2L"
          ? 2
          : formData.waterIntake === "2to3L"
          ? 3
          : 4,

      jobType:
        formData.jobType === "desk"
          ? "Office"
          : formData.jobType === "standing"
          ? "Standing"
          : formData.jobType === "physical"
          ? "Physical"
          : "Mixed",
    };

    await createUserProfile(payload);

    const result = await getOnboardingResult();

    localStorage.setItem(
      "userRecommendations",
      JSON.stringify(result)
    );

    localStorage.setItem("onboardingComplete", "true");

    navigate("/dashboard");
  } catch (error) {
    console.error(error);
    alert("Failed to save profile");
  }
};

  // Check if current step is valid
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.age && formData.gender && formData.height && formData.weight;
      case 2:
        return formData.healthCondition.length > 0;
      case 3:
        return formData.goal;
      case 4:
        return formData.activityLevel;
      case 5:
        return formData.sleepHours && formData.waterIntake && formData.jobType;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-mint-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t.step} {currentStep} {t.of} {totalSteps}
            </span>
            <span className="text-sm font-medium text-sky-600 dark:text-sky-400">
              {Math.round(progressPercentage)}% {t.complete}
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-sky-500 to-mint-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors duration-300">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full mb-4">
                  <User className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t.basicInfo}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t.basicInfoDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.age}
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateFormData('age', e.target.value)}
                    placeholder={t.ageExample}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.gender}
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => updateFormData('gender', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                  >
                    <option value="">{t.selectGender}</option>
                    <option value="male">{t.male}</option>
                    <option value="female">{t.female}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.height} (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => updateFormData('height', e.target.value)}
                    placeholder={t.heightExample}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.weight} (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => updateFormData('weight', e.target.value)}
                    placeholder={t.weightExample}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Health Condition */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-mint-100 dark:bg-mint-900/30 rounded-full mb-4">
                  <Heart className="w-8 h-8 text-mint-600 dark:text-mint-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t.healthCondition}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t.healthConditionDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { key: 'healthy', label: t.healthy },
                  { key: 'overweight', label: t.overweight },
                  { key: 'underweight', label: t.underweight },
                  { key: 'jointPain', label: t.jointPain },
                  { key: 'recovering', label: t.recovering },
                  { key: 'highStress', label: t.highStress },
                  { key: 'other', label: t.other }
                ].map((condition) => (
                  <button
                    key={condition.key}
                    onClick={() => toggleHealthCondition(condition.key)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.healthCondition.includes(condition.key)
                        ? 'border-mint-500 bg-mint-50 dark:bg-mint-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-mint-300 dark:hover:border-mint-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {condition.label}
                      </span>
                      {formData.healthCondition.includes(condition.key) && (
                        <CheckCircle className="w-5 h-5 text-mint-600 dark:text-mint-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Goal */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                  <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t.yourGoal}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t.yourGoalDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { key: 'loseWeight', label: t.loseWeight, emoji: '🔥' },
                  { key: 'gainMuscle', label: t.gainMuscle, emoji: '💪' },
                  { key: 'stayActive', label: t.stayActive, emoji: '🏃' },
                  { key: 'improveFitness', label: t.improveFitness, emoji: '⚡' },
                  { key: 'reduceStress', label: t.reduceStress, emoji: '🧘' },
                  { key: 'eventPrep', label: t.eventPrep, emoji: '🎯' }
                ].map((goal) => (
                  <button
                    key={goal.key}
                    onClick={() => updateFormData('goal', goal.key)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.goal === goal.key
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{goal.emoji}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {goal.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Activity Level */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4">
                  <Activity className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t.activityLevel}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t.activityLevelDesc}
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'sedentary', label: t.sedentary, desc: t.sedentaryDesc },
                  { key: 'light', label: t.light, desc: t.lightDesc },
                  { key: 'moderate', label: t.moderate, desc: t.moderateDesc },
                  { key: 'active', label: t.active, desc: t.activeDesc },
                  { key: 'veryActive', label: t.veryActive, desc: t.veryActiveDesc }
                ].map((level) => (
                  <button
                    key={level.key}
                    onClick={() => updateFormData('activityLevel', level.key)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.activityLevel === level.key
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-700'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white mb-1">
                      {level.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {level.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Lifestyle */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full mb-4">
                  <Coffee className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t.lifestyle}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t.lifestyleDesc}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.sleepHours}
                  </label>
                  <select
                    value={formData.sleepHours}
                    onChange={(e) => updateFormData('sleepHours', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                  >
                    <option value="">{t.selectSleep}</option>
                    <option value="less5">{t.less5}</option>
                    <option value="5to6">{t.fiveToSix}</option>
                    <option value="7to8">{t.sevenToEight}</option>
                    <option value="more8">{t.moreThanEight}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.averageWater}
                  </label>
                  <select
                    value={formData.waterIntake}
                    onChange={(e) => updateFormData('waterIntake', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                  >
                    <option value="">{t.selectWater}</option>
                    <option value="less1L">{t.lessThan1L}</option>
                    <option value="1to2L">{t.oneToTwoL}</option>
                    <option value="2to3L">{t.twoToThreeL}</option>
                    <option value="more3L">{t.moreThan3L}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.jobType}
                  </label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => updateFormData('jobType', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                  >
                    <option value="">{t.selectJob}</option>
                    <option value="desk">{t.deskJob}</option>
                    <option value="standing">{t.standingJob}</option>
                    <option value="physical">{t.physicalJob}</option>
                    <option value="mixed">{t.mixedJob}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                currentStep === 1
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              {t.previous}
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  isStepValid()
                    ? 'bg-gradient-to-r from-sky-500 to-mint-500 text-white hover:shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                {t.next}
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  isStepValid()
                    ? 'bg-gradient-to-r from-green-500 to-mint-500 text-white hover:shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                {t.complete}
              </button>
            )}
          </div>
        </div>

        {/* Skip Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              localStorage.setItem('onboardingComplete', 'true');
              navigate('/dashboard');
            }}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            {t.skipForNow}
          </button>
        </div>
      </div>
    </div>
  );
}