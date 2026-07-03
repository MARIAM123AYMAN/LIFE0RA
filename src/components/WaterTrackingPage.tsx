import { WaterProgressRing } from './WaterProgressRing';
import { WaterActionButtons } from './WaterActionButtons';
import { WaterTimeline } from './WaterTimeline';
import { WaterChartContainer } from './WaterChartContainer';
import { WaterStreakCard } from './WaterStreakCard';
import { NearbyWaterSources } from './NearbyWaterSources';
import { WaterDayNavigator } from './WaterDayNavigator';
import { WaterInsightsCard } from './WaterInsightsCard';
import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { WaterApiKeyModal } from './WaterApiKeyModal';
import { notifications } from '../utils/notifications';
import { useApp } from '../contexts/AppContext';
import { t } from '../utils/translations';
import { Navigate, useNavigate } from 'react-router-dom';

interface WaterLog {
  id: number;
  amount: number;
  time: string;
  timestamp: number;
  date: string; // YYYY-MM-DD format
}

interface DailyWaterData {
  [date: string]: WaterLog[];
}

export function WaterTrackingPage() {
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState(null);
  const [todayData, setTodayData] = useState<any>(null);
  const [streakData, setStreakData] = useState<any>(null);
  const { language } = useApp();
  const navigate = useNavigate();

const fetchTimeline = async () => {
  try {
    const response = await fetch(
      "http://balancelifeapp.runasp.net/api/water/timeline",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await response.json();

    setTimelineData(data);
  } catch (error) {
    console.error(error);
  }
};

const fetchWaterStreak = async () => {
  try {
    const response = await fetch(
      "http://balancelifeapp.runasp.net/api/water/streak",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await response.json();
    console.log(data);
console.log(data.logs);

    setStreakData(data);
  } catch (error) {
    console.error(error);
  }
};
const fetchWeeklyWater = async () => {
  const response = await fetch(
    "http://balancelifeapp.runasp.net/api/water/weekly",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const data = await response.json();
  setWeeklyData(data);
};
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const [waterData, setWaterData] = useState<DailyWaterData>(() => {
    const saved = localStorage.getItem('waterTrackingData');
    return saved ? JSON.parse(saved) : {};
  });

  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('geminiApiKey') || '';
  });

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const targetWater = parseInt(localStorage.getItem('dailyWaterGoal') || '2000');

  // Get logs for selected date
  const currentDayLogs = waterData[selectedDate] || [];
  const currentDayTotal = currentDayLogs.reduce((sum, log) => sum + log.amount, 0);

  // Save to localStorage whenever waterData changes

const fetchTodayWater = async () => {
  try {
    const response = await fetch(
      "http://balancelifeapp.runasp.net/api/water/today",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await response.json();
    console.log("TODAY API", data);
    console.log("TODAY API", data);

    setTodayData(data);
    const today =
  new Date().toISOString().split("T")[0];

localStorage.setItem(
  `water-${today}`,
  JSON.stringify(data)
);
  } catch (error) {
    console.error(error);
  }
};
useEffect(() => {
  fetchTodayWater();
  fetchWaterStreak();
  fetchWeeklyWater();
  fetchTimeline();
}, []);

console.log("todayData =>", todayData);
console.log("weeklyData =>", weeklyData);
console.log("streakData =>", streakData);
console.log("timelineData =>", timelineData);
  // Calculate streak

const handleAddWater = async (amount: number) => {
   console.log("ADD WATER:", amount);
  try {
    const response = await fetch(
      "http://balancelifeapp.runasp.net/api/water",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amountInMl: amount,
        }),
      }
    );
console.log("STATUS", response.status);
const message = await response.text();
console.log(message);
    if (!response.ok) {
      throw new Error("Failed to add water");
    }


await fetchTodayWater();
await fetchWeeklyWater();
await fetchWaterStreak();
await fetchTimeline();

    notifications.waterAdded(
      Math.floor(amount / 250)
    );
  } catch (error) {
    console.error(error);
  }
};

  

const handleDateChange = async (date: string) => {
  setSelectedDate(date);

  const saved = localStorage.getItem(
    `water-${date}`
  );

  if (saved) {
    setTodayData(JSON.parse(saved));
  }
};

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('geminiApiKey', key);
    setIsApiKeyModalOpen(false);
    notifications.settingsSaved();
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background transition-colors duration-300">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-sky-900 dark:text-sky-100">{t('waterTracking', language)}</h1>
          <button
            onClick={() => navigate("/settings")}
            className="p-2 rounded-xl bg-card shadow-md text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-gray-800 transition-colors border border-sky-100 dark:border-gray-700"
            title=" Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sky-600 dark:text-sky-400">{t('monitorHydration', language)}</p>
      </div>

      {/* Date Navigator */}
<WaterDayNavigator
  selectedDate={selectedDate}
  onDateChange={handleDateChange}
  waterData={{
    [selectedDate]: [
      {
                id: 1,
        amount: todayData?.totalMl || 0,
        time: "",
        timestamp: Date.now(),
        date: selectedDate,
      },
    ],
  }}
  targetWater={todayData?.goalMl || 2000}
/>

      {/* Main Content: 2-column on Desktop, Stacked on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Main Stats Card */}
<WaterProgressRing
  current={todayData?.totalMl || 0}
  target={todayData?.goalMl || 2000}
  selectedDate={selectedDate}
  cups={todayData?.cups || 0}
/>

          {/* Quick Add Water Section */}
          <WaterActionButtons
  onAddWater={handleAddWater}
  cups={todayData?.cups || 0}
/>

          {/* Water Streak Banner */}
<WaterStreakCard
  streak={streakData?.currentStreak || 0}
  cups={todayData?.cups || 0}
  percentage={todayData?.percentage || 0}
/>

          {/* AI Insights */}
          {apiKey && (
            <WaterInsightsCard
              apiKey={apiKey}
              currentIntake={currentDayTotal}
              targetIntake={targetWater}
              logs={currentDayLogs}
              selectedDate={selectedDate}
            />
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Daily Water Timeline */}
          <WaterTimeline logs={timelineData} selectedDate={selectedDate} />

          {/* Weekly Hydration Chart */}
       <WaterChartContainer
  waterData={weeklyData}
  targetWater={targetWater}
/>
          {/* Nearby Water Sources */}
          <NearbyWaterSources />
        </div>
      </div>

      {/* API Key Modal */}
      <WaterApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleSaveApiKey}
        currentApiKey={apiKey}
      />
    </div>
  );
}