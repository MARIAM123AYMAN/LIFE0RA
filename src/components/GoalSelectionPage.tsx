import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, TrendingDown, Dumbbell, Footprints, Heart, Zap, HeartPulse, Trophy, ArrowLeft } from 'lucide-react';
import { notifications } from '../utils/notifications';
import { useApp } from '../contexts/AppContext';

export function GoalSelectionPage() {
  const { setFitnessGoal } = useApp();
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState('');

  const goals = [
    {
      id: 'lose-weight',
      name: 'Lose Weight',
      icon: TrendingDown,
      description: 'Burn calories and reduce body fat',
      color: 'from-orange-400 to-red-400',
    },
    {
      id: 'gain-muscle',
      name: 'Gain Muscle',
      icon: Dumbbell,
      description: 'Build strength and muscle mass',
      color: 'from-blue-400 to-indigo-400',
    },
    {
      id: 'stay-active',
      name: 'Walk & Stay Active',
      icon: Footprints,
      description: 'Maintain daily movement and steps',
      color: 'from-mint-400 to-teal-400',
    },
    {
      id: 'stay-healthy',
      name: 'Stay Healthy',
      icon: Heart,
      description: 'Overall wellness and health',
      color: 'from-pink-400 to-rose-400',
    },
    {
      id: 'improve-fitness',
      name: 'Improve Fitness',
      icon: Zap,
      description: 'Enhance endurance and stamina',
      color: 'from-yellow-400 to-orange-400',
    },
    {
      id: 'reduce-stress',
      name: 'Reduce Stress',
      icon: HeartPulse,
      description: 'Relax mind and body',
      color: 'from-purple-400 to-pink-400',
    },
    {
      id: 'rehabilitation',
      name: 'Rehabilitation',
      icon: Heart,
      description: 'Recovery and injury prevention',
      color: 'from-sky-400 to-cyan-400',
    },
    {
      id: 'event-preparation',
      name: 'Event Preparation',
      icon: Trophy,
      description: 'Train for specific events',
      color: 'from-amber-400 to-yellow-400',
    },
  ];

  const handleContinue = () => {
    if (selectedGoal) {
      // Find the goal name
      const goalData = goals.find(g => g.id === selectedGoal);
      if (goalData) {
        // Save goal to localStorage
       setFitnessGoal(goalData.name);
localStorage.setItem("fitnessGoal", goalData.name);
localStorage.setItem("fitnessGoalId", goalData.id);
setFitnessGoal(goalData.name);
// AppContext هيحفظه في localStorage تلقائيًا
        notifications.goalSet(goalData.name);
        navigate('/sports');
      }
    } else {
      notifications.error('Please select a goal');
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/sports')}
          className="flex items-center gap-2 text-sky-600 hover:text-sky-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Sports</span>
        </button>
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-sky-400 to-mint-400 flex items-center justify-center">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-sky-900 mb-4">Choose Your Goal</h1>
          <p className="text-sky-600">
            Select your fitness goal to get personalized workout plans and recommendations
          </p>
        </div>
      </div>

      {/* Goal Cards */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const isSelected = selectedGoal === goal.id;

            return (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={`bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all text-left ${
                  isSelected ? 'ring-4 ring-sky-300 shadow-md' : ''
                }`}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${goal.color} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sky-900 mb-2">{goal.name}</h3>
                    <p className="text-sm text-sky-600">{goal.description}</p>
                  </div>
                  {isSelected && (
                    <div className="mt-2 w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-mint-500 flex items-center justify-center">
                      <span className="text-white">✓</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div className="max-w-md mx-auto">
        <button
          onClick={handleContinue}
          disabled={!selectedGoal}
          className={`w-full px-8 py-4 rounded-2xl text-white shadow-sm transition-all ${
            selectedGoal
              ? 'bg-gradient-to-r from-sky-500 to-mint-500 hover:from-sky-600 hover:to-mint-600 hover:shadow-md'
              : 'bg-sky-200 cursor-not-allowed'
          }`}
        >
          Continue with Selected Goal
        </button>
      </div>
    </div>
  );
}