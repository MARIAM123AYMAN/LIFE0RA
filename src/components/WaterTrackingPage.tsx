import { WaterProgressRing } from './WaterProgressRing';
import { WaterActionButtons } from './WaterActionButtons';
import { WaterTimeline } from './WaterTimeline';
import { WaterChartContainer } from './WaterChartContainer';
import { WaterStreakCard } from './WaterStreakCard';
import { NearbyWaterSources } from './NearbyWaterSources';
// import { WaterDayNavigator } from './WaterDayNavigator';
import { WaterInsightsCard } from './WaterInsightsCard';
import { useState, useEffect } from 'react';
import { Settings ,Calendar  } from 'lucide-react';
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
// const today = new Date().toISOString().split("T")[0];
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
// const { selectedDate, setSelectedDate } = useApp();
  
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
  const today = new Date();
const todayString = today.toISOString().split("T")[0]; // String لو محتاجاه للـ API

const currentDayLogs = waterData[todayString] || [];
   const currentDayTotal = currentDayLogs.reduce((sum, log) => sum + log.amount, 0);

  // Save to localStorage whenever waterData changes

const options: Intl.DateTimeFormatOptions = {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
};

const formattedDate = today.toLocaleDateString("en-US", options);
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

useEffect(() => {
  const today = new Date().toISOString().split("T")[0];
  const lastDate = localStorage.getItem("lastWaterDate");

  if (lastDate !== today) {
    setTodayData({
      totalMl: 0,
      goalMl: 2000,
      percentage: 0,
      cups: 0,
      isGoalCompleted: false,
      statusMessage: "Start drinking water today 💧",
    });

    localStorage.setItem("lastWaterDate", today);
  } else {
    fetchTodayWater();
  }
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

  

// const handleDateChange = async (date: string) => {
//   setSelectedDate(date);

//   localStorage.setItem(
//     "dashboardDate",
//     date
//   );


//   const saved = localStorage.getItem(
//     `water-${date}`
//   );

//   if (saved) {
//     setTodayData(JSON.parse(saved));
//   }
// };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('geminiApiKey', key);
    setIsApiKeyModalOpen(false);
    notifications.settingsSaved();
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background transition-colors duration-300">
      {/* Header Section */}
  
<div className="mb-8">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">

    <div>
      <h1 className="text-sky-900 dark:text-sky-100 mb-2">
        {t("waterTracking", language)}
      </h1>

      <p className="text-sky-600 dark:text-sky-400">
        {t("monitorHydration", language)}
      </p>
    </div>

    <div className="flex items-center gap-3">

      <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-sky-200 shadow-sm text-sky-700">
        <Calendar className="w-5 h-5" />
        <span>{formattedDate}</span>
      </div>

      <button
        onClick={() => navigate("/settings")}
        className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white border border-sky-200 shadow-sm text-sky-700 hover:bg-sky-50 transition-colors"
      >
        <Settings className="w-5 h-5" />
      </button>

    </div>
  </div>
</div>

      {/* Date Navigator */}
{/* <WaterDayNavigator
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
/> */}

      {/* Main Content: 2-column on Desktop, Stacked on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Main Stats Card */}
<WaterProgressRing
  current={todayData?.totalMl || 0}
  target={todayData?.goalMl || 2000}
selectedDate={new Date().toISOString().split("T")[0]}
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
              selectedDate={new Date().toISOString().split("T")[0]}
            />
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Daily Water Timeline */}
          <WaterTimeline logs={timelineData} selectedDate={new Date().toISOString().split("T")[0]} />

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