import { useState } from 'react';
import { X, Clock, Flame, Activity } from 'lucide-react';

interface AddWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddWorkoutModal({ isOpen, onClose }: AddWorkoutModalProps) {
  const [workoutName, setWorkoutName] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [workoutType, setWorkoutType] = useState('cardio');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle workout submission
    console.log({ workoutName, duration, calories, workoutType });
    onClose();
    // Reset form
    setWorkoutName('');
    setDuration('');
    setCalories('');
    setWorkoutType('cardio');
  };

  const workoutTypes = [
    { id: 'cardio', name: 'Cardio', icon: '🏃', color: 'from-orange-400 to-red-400' },
    { id: 'strength', name: 'Strength', icon: '💪', color: 'from-sky-400 to-blue-400' },
    { id: 'yoga', name: 'Yoga', icon: '🧘', color: 'from-purple-400 to-pink-400' },
    { id: 'sports', name: 'Sports', icon: '⚽', color: 'from-mint-400 to-teal-400' },
    { id: 'walking', name: 'Walking', icon: '🚶', color: 'from-green-400 to-emerald-400' },
    { id: 'other', name: 'Other', icon: '🎯', color: 'from-amber-400 to-yellow-400' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-sky-100 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-mint-400 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-sky-900">Add Workout</h2>
                <p className="text-sm text-sky-600">Log your exercise activity</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-sky-50 hover:bg-sky-100 flex items-center justify-center text-sky-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Workout Type Selection */}
          <div className="mb-6">
            <label className="block text-sky-900 mb-3">Workout Type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {workoutTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setWorkoutType(type.id)}
                  className={`p-4 rounded-2xl transition-all ${
                    workoutType === type.id
                      ? 'bg-gradient-to-r from-sky-100 to-mint-100 border-2 border-sky-300'
                      : 'bg-sky-50 hover:bg-sky-100 border-2 border-transparent'
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <p className="text-sm text-sky-900">{type.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Workout Name */}
          <div className="mb-6">
            <label className="block text-sky-900 mb-3">
              Workout Name
            </label>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="e.g., Morning Run, HIIT Session"
              className="w-full px-4 py-3 rounded-2xl bg-sky-50 border border-sky-100 text-sky-900 placeholder:text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
              required
            />
          </div>

          {/* Duration and Calories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sky-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duration (minutes)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                className="w-full px-4 py-3 rounded-2xl bg-sky-50 border border-sky-100 text-sky-900 placeholder:text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sky-900 mb-3 flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Calories Burned
              </label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="250"
                className="w-full px-4 py-3 rounded-2xl bg-sky-50 border border-sky-100 text-sky-900 placeholder:text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
                required
                min="1"
              />
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-mint-50">
            <p className="text-sm text-sky-900 mb-2">💡 Quick Suggestions</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Running 30min', duration: 30, calories: 300 },
                { name: 'Cycling 45min', duration: 45, calories: 350 },
                { name: 'Yoga 20min', duration: 20, calories: 100 },
              ].map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setWorkoutName(suggestion.name);
                    setDuration(String(suggestion.duration));
                    setCalories(String(suggestion.calories));
                  }}
                  className="px-3 py-2 rounded-xl bg-white text-sky-700 text-sm hover:bg-sky-100 transition-colors"
                >
                  {suggestion.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-2xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-mint-500 text-white hover:from-sky-600 hover:to-mint-600 transition-all shadow-sm"
            >
              Save Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
