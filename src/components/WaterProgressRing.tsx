import { Droplets, GlassWater } from 'lucide-react';

interface WaterProgressRingProps {
  current: number;
  target: number;
  selectedDate: string;
  cups: number;
}

export function WaterProgressRing({ current, target, selectedDate , cups}: WaterProgressRingProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const circumference = 2 * Math.PI * 90;
  
  const strokeDashoffset = circumference - (percentage / 100) * circumference;


let ringColor = "#0ea5e9"; // أزرق

if (percentage >= 100 && percentage <= 120) {
  ringColor = "#22c55e"; // أخضر
} else if (percentage > 120) {
  ringColor = "#ef4444"; // أحمر
}
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = dateStr === today.toISOString().split('T')[0];
    
    if (isToday) return 'Today';
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sky-900">Daily Goal</h2>
          <p className="text-sm text-sky-600">{formatDate(selectedDate)}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
          <Droplets className="w-5 h-5 text-sky-600" />
        </div>
      </div>

      {/* Circular Progress Ring */}
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative w-48 h-48">
          <svg className="w-48 h-48 transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="96"
              cy="96"
              r="90"
              stroke="#e0f2fe"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress Circle */}
      <circle
  cx="96"
  cy="96"
  r="90"
  stroke={ringColor}
  strokeWidth="12"
  fill="none"
  strokeDasharray={circumference}
  strokeDashoffset={strokeDashoffset}
  strokeLinecap="round"
  className="transition-all duration-500"
/>
          </svg>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl text-sky-900 mb-1">
              {current}ml
            </p>
            <p className="text-sm text-sky-600">/ {target}ml</p>
          </div>
        </div>

        {/* Percentage */}
        <div className="mt-6">
          <p
  className="text-xl"
  style={{ color: ringColor }}
>
  {Math.round(percentage)}% Complete
</p></div>
      </div>
<div className="mt-6 flex flex-wrap justify-center gap-3">
  {Array.from({ length: Math.ceil(target/ 250) }).map((_, index) => (
    <GlassWater
      key={index}
      className={`
        w-7 h-7 transition-all
        ${
          index < cups
            ? "text-sky-500"
            : "text-sky-200"
        }
      `}
    />
  ))}
</div>
    </div>
  );
}