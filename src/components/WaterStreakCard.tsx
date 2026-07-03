import { Award, Flame } from 'lucide-react';

interface WaterStreakCardProps {
  streak: number;
  cups: number;
  percentage: number;
}

export function WaterStreakCard({ streak , cups,percentage}: WaterStreakCardProps) {

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border-2 border-sky-100">
      <div className=" gap-4">
        <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
          <Award className="w-6 h-6 text-sky-600" />
        </div>
        
        <div className="flex-1">
          <div className="  gap-2 mb-2">
<h3 className="text-sky-900">
  {percentage === 0
    ? "Start Your Journey 💧"
    : percentage < 25
    ? "Good Start 🌱"
    : percentage < 50
    ? "Keep Going 🚀"
    : percentage < 100
    ? "Almost There 🔥"
    : percentage <= 120
    ? "Goal Achieved 🎉"
    : "Hydration Beast 👑"}
</h3>

<p className="text-sky-700">
  {percentage === 0
    ? "Take your first glass of water today."
    : `You've completed ${cups} cups today and reached ${Math.round(
        percentage
      )}% of your goal.`}
</p>

<p className="text-sm text-sky-600  mt-2">
  {percentage < 100
    ? `${Math.max(
        0,
        100 - Math.round(percentage)
      )}% left to reach today's goal.`
    : `Amazing! You're staying perfectly hydrated today.`}
</p>
        </div>
        </div>
      </div>
    </div>
  );
}
