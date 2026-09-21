import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface WaterLog {
  id: number;
  amount: number;
  time: string;
  timestamp: number;
  date: string;
}

interface DailyWaterData {
  [date: string]: WaterLog[];
}

interface WaterDayNavigatorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  waterData: DailyWaterData;
  targetWater: number;
}

export function WaterDayNavigator({
  selectedDate,
  onDateChange,
  waterData,
  targetWater,
}: WaterDayNavigatorProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = dateStr === today.toISOString().split('T')[0];
    const isYesterday = dateStr === yesterday.toISOString().split('T')[0];

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const goToPreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    onDateChange(date.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const date = new Date(selectedDate);
    const today = new Date().toISOString().split('T')[0];
    
    // Don't go beyond today
    if (selectedDate >= today) return;
    
    date.setDate(date.getDate() + 1);
    onDateChange(date.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    const today = new Date();
    onDateChange(today.toISOString().split('T')[0]);
  };

  const getDayIntake = (dateStr: string) => {
    return (waterData[dateStr] || []).reduce((sum, log) => sum + log.amount, 0);
  };

  const currentIntake = getDayIntake(selectedDate);
  const percentage = Math.round((currentIntake / targetWater) * 100);
  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-xl p-4 shadow-md mb-6">
      <div className="flex items-center justify-between gap-4">
        {/* Previous Day Button */}
        <button
          onClick={goToPreviousDay}
          className="p-2 rounded-xl hover:bg-sky-50 text-sky-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Date Display */}
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-sky-600" />
            <h3 className="text-sky-900">{formatDate(selectedDate)}</h3>
          </div>
          <p className="text-sm text-sky-600">
            {currentIntake}ml / {targetWater}ml ({percentage}%)
          </p>
        </div>

        {/* Next Day Button */}
        <button
          onClick={goToNextDay}
          disabled={isToday}
          className={`p-2 rounded-xl transition-colors ${
            isToday
              ? 'text-sky-300 cursor-not-allowed'
              : 'hover:bg-sky-50 text-sky-600'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Jump to Today */}
      {!isToday && (
        <div className="mt-3 pt-3 border-t border-sky-100">
          <button
            onClick={goToToday}
            className="w-full py-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors text-sm"
          >
            Jump to Today
          </button>
        </div>
      )}
    </div>
  );
}
