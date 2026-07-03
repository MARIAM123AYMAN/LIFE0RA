import { ArrowLeft, Dumbbell, Clock, Flame, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOnboardingResult } from "../services/onboardingService";
import {
  startWorkout,
  endWorkout,
  getTodaySummary,
  getActiveWorkout,
  getWorkoutHistory,
} from "../services/workoutService";
import { getGroupedWorkouts } from "../services/workoutService";

export function WorkoutsPage() {
  const navigate = useNavigate();
  const [currentGoal, setCurrentGoal] = useState("");
  const [workoutResults, setWorkoutResults] = useState<Record<number, any>>({});
  const [summary, setSummary] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [finishedWorkoutId, setFinishedWorkoutId] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<any>(null);
  const [activeWorkoutId, setActiveWorkoutId] = useState<number | null>(null);
  const [workoutCategories, setWorkoutCategories] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<number | null>(null);

  const activityCalories = Number(localStorage.getItem("activityCalories"));
  const activitySeconds = Number(localStorage.getItem("activitySeconds"));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-teal-100 text-teal-600';
      case 'Intermediate':
        return 'bg-sky-100 text-sky-600';
      case 'Advanced':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-sky-100 text-sky-600';
    }
  };

  const handleStartWorkout = async (workoutId: number) => {
    try {
      if (activeSession) {
        alert("Please finish your current workout first.");
        return;
      }
      const { data } = await startWorkout(workoutId);
      localStorage.removeItem("lastWorkoutResult");
      localStorage.removeItem("finishedWorkoutId");

      setLastResult(null);
      setFinishedWorkoutId(null);
      localStorage.setItem("sessionId", data.sessionId.toString());
      localStorage.setItem("activeWorkoutId", workoutId.toString());
      setActiveWorkoutId(workoutId);
      navigate("/sports/activity");
      setActiveSession(data.sessionId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEndWorkout = async () => {
    try {
      const sessionId = Number(localStorage.getItem("sessionId"));
      if (!activeSession) return;

      const { data } = await endWorkout(activeSession);
      await loadHistory();
      console.log(data);
      setLastResult(data);
      setFinishedWorkoutId(activeWorkoutId);
      setActiveSession(null);
      setActiveWorkoutId(null);
      console.log(data);
      setWorkoutResults(prev => ({
        ...prev,
        [activeWorkoutId!]: data
      }));
      await loadTodaySummary();
      await loadHistory();
      localStorage.removeItem("sessionId");
      localStorage.removeItem("activeWorkoutId");
    } catch (error) {
      console.log(error);
    }
  };

  const loadTodaySummary = async () => {
    const { data } = await getTodaySummary();
    setSummary(data);
  };

  const loadHistory = async () => {
    const { data } = await getWorkoutHistory();
    setHistory(data);
  };

  const checkActiveWorkout = async () => {
    try {
      const workoutId = localStorage.getItem("activeWorkoutId");
      if (workoutId) {
        setActiveWorkoutId(Number(workoutId));
      }
      const { data } = await getActiveWorkout();
      setActiveSession(data.sessionId);
      localStorage.setItem("sessionId", data.sessionId.toString());
    } catch {
      setActiveSession(null);
    }
  };

  const loadGoal = async () => {
    const data = await getOnboardingResult();
    setCurrentGoal(data.goal);
    console.log("Goal =", data.goal);
    console.log(data);
  };

  const loadWorkouts = async () => {
    const { data } = await getGroupedWorkouts();
    console.log("Grouped Workouts =", data);

    const styles = {
      cardio: {
        color: "bg-red-100",
        iconColor: "text-red-500",
      },
      strength: {
        color: "bg-blue-100",
        iconColor: "text-blue-500",
      },
      flexibility: {
        color: "bg-green-100",
        iconColor: "text-green-500",
      },
      home: {
        color: "bg-yellow-100",
        iconColor: "text-yellow-500",
      },
    };

    setWorkoutCategories(
      Object.entries(data).map(([category, workouts]) => ({
        category,
        workouts,
        ...styles[category as keyof typeof styles],
      }))
    );
    console.log(workoutCategories);
  };

  useEffect(() => {
    loadGoal();
    loadWorkouts();
    checkActiveWorkout();
    loadTodaySummary();
    loadHistory();
  }, []);

  useEffect(() => {
    const result = localStorage.getItem("lastWorkoutResult");
    const workoutId = localStorage.getItem("finishedWorkoutId");

    if (result) {
      setLastResult(JSON.parse(result));
    }
    if (workoutId) {
      setFinishedWorkoutId(Number(workoutId));
    }
  }, []);

  useEffect(() => {
    console.log(workoutCategories);
  }, [workoutCategories]);

  useEffect(() => {
    const calories = Number(localStorage.getItem("activityCalories"));
    const seconds = Number(localStorage.getItem("activitySeconds"));

    if (calories) {
      setWorkoutResults(prev => ({
        ...prev,
        [activeWorkoutId!]: { caloriesBurned: calories, duration: seconds / 60 }
      }));
    }
  }, []);

  const hasWorkouts = workoutCategories.some((c) => c.workouts.length > 0);
  
  const categoryNames = {
    cardio: "Cardio",
    strength: "Strength",
    flexibility: "Flexibility",
    home: "Home Workout",
  };

  if (workoutCategories.length === 0) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-sky-600">Loading workouts...</p>
      </div>
    );
  }

  const isWorkoutCompleted = (workout: any) => {
    const result = workoutResults[workout.id];
    const completed = result && result.caloriesBurned >= workout.calories;
    if (!result) return false;
    return result.caloriesBurned >= workout.calories;
  };

  return (
    <div className="min-h-screen p-4 md:p-8 pb-24 md:pb-8">
      {activeSession && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 mb-6">
          <h2 className="font-bold text-sky-800">🏋 Active Workout</h2>
          <p>Session #{activeSession}</p>
          <p className="text-green-600">● Running</p>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 ">
        <button
          onClick={() => navigate('/sports')}
          className="flex items-center gap-2 text-sky-600 hover:text-sky-900 mb-4 transition-colors"
          title="Back to Sports Dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-sky-900 mb-2">Workout Plans</h1>
        <p className="text-sky-600">
          Customized for your goal: <strong>{currentGoal}</strong>
        </p>
      </div>

      {/* Today's Summary Card */}
      <div className="bg-sky-100 rounded-3xl p-6 shadow-sm mb-8">
        <h2 className="text-2xl font-bold mb-4 text-sky-900 ">Today's Summary</h2>
        <div className="flex justify-between gap-4 text-sky-900 text-xl flex-start p-3 ">
          <div>
            <p className="text-gray-700 ">Workouts</p>
            <h3 >{summary?.totalWorkouts ?? 0}</h3>
          </div>
          <div>
            <p className="text-gray-500">Calories</p>
            <h3>{summary?.totalCalories ?? 0} kcal</h3>
          </div>
          <div>
            <p className="text-gray-500">Duration</p>
            <h3>{summary?.totalDuration ?? 0} min</h3>
          </div>
        </div>
      </div>

      {/* Current Goal Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center">
            <Target className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <h2 className="text-sky-900">Your Goal</h2>
            <p className="text-2xl font-bold text-sky-900">{currentGoal}</p>
          </div>
        </div>
        <p className="text-sm text-sky-600">
          💡 Workouts are recommended based on your selected fitness goal. Change your goal anytime from the Sports Dashboard.
        </p>
      </div>

      {/* Workout Categories */}
      {workoutCategories.map((category, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-bold text-sky-900 mb-6">
            {categoryNames[category.category as keyof typeof categoryNames]}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.workouts.map((workout: any, wIndex: number) => {
              const result = workoutResults[workout.id];
              const completed = result?.caloriesBurned >= workout.calories;

              return (
                <div
                  key={wIndex}
                  className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  {/* Workout Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Dumbbell className={`w-12 h-12 ${category.iconColor}`} />
                    </div>
                    {/* <div className={`w-16 h-16 rounded-2xl ${currentGoal} flex items-center justify-center group-hover:scale-110 transition-transform`}> */}
                    <div className='text-sky-900  bg-sky-100 p-4 rounded-2xl'>
                      {/* <Dumbbell className={`w-12 h-12 ${category.iconColor}`} /> */}
                      {currentGoal}
                    </div>
                  </div>

                  {/* Workout Info */}
                  <h3 className="text-sky-900 mb-4">{workout.name}</h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-sky-600" title="Workout duration">
                        <Clock className="w-4 h-4" />
                        <span>{workout.duration} min</span>
                      </div>
                      <div className="flex items-center gap-2 text-sky-600" title="Estimated calories">
                        <Flame className="w-4 h-4" />
                        <span>{workout.calories} kcal</span>
                      </div>
                    </div>
                  </div>

                  {result && (
                    <div className="rounded-3xl bg-green-50 p-5 mt-5">
                      {completed ? (
                        <div className="rounded-2xl bg-green-50 p-4">
                          <p>🎉 Workout Completed</p>
                          <p>{result.duration} min</p>
                          <p>{result.caloriesBurned} kcal</p>
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-yellow-50 p-4">
                          <p>Burned {result.caloriesBurned} / {workout.calories} kcal</p>
                          <p>Need {workout.calories - result.caloriesBurned} kcal more 💪</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Start Button */}
                  <div className="mt-5">
                    {activeWorkoutId === workout.id ? (
                      <button
                        onClick={handleEndWorkout}
                        className="w-full rounded-xl bg-sky-100 hover:bg-bg-sky-900 py-3 text-white font-semibold"
                      >
                        End Workout
                      </button>
                    ) : (
                      <button
                        disabled={activeSession !== null}
                        onClick={() => handleStartWorkout(workout.id)}
                        className={`w-full rounded-xl py-3 text-white bg-sky-900 ${
                          activeSession
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-sky-700 hover:bg-sky-800"
                        }`}
                      >
                        Start Workout
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Workout History */}
      <div className="bg-white rounded-3xl p-6 mt-10 shadow">
        <h2 className="text-xl font-bold mb-4">Workout History</h2>
        {history.map((item, index) => (
          <div key={index} className="border-b py-3 flex justify-between">
            <div>
              <p>{item.workoutName}</p>
              <p>{item.duration} min</p>
            </div>
            <div>
              <p>{item.caloriesBurned} kcal</p>
            </div>
          </div>
        ))}
      </div>
    </div> 
  );
}