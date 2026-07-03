import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

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

interface WaterChartContainerProps {
  waterData: any;
  targetWater: number;
}

export function WaterChartContainer({ waterData, targetWater }: WaterChartContainerProps) {
  // Generate last 7 days data

const chartData =
  waterData?.days?.map((day: any) => ({
    day: day.dayName,
    amount: day.totalMl,
  })) || [];
 const totalWeekly = chartData.reduce(
  (sum: number, day: any) =>
    sum + day.amount,
  0
);
const averageDaily = Math.round(totalWeekly / 7);

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h2 className="text-sky-900 mb-6">Weekly Hydration</h2>
      
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
          <XAxis
            dataKey="day"
            stroke="#0ea5e9"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#0ea5e9"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e0f2fe',
              borderRadius: '12px',
            }}
            formatter={(value: number) => [`${value}ml`, 'Water']}
          />
          <ReferenceLine
            y={targetWater}
            stroke="#0ea5e9"
            strokeDasharray="3 3"
            label={{ value: 'Goal', position: 'right', fill: '#0ea5e9' }}
          />
          <Bar
            dataKey="amount"
            fill="#0ea5e9"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 pt-4 border-t border-sky-100">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-sky-600">Weekly Total</p>
            <p className="text-xl text-sky-900">{totalWeekly}ml</p>
          </div>
          <div>
            <p className="text-sm text-sky-600">Daily Average</p>
            <p className="text-xl text-sky-900">{averageDaily}ml</p>
          </div>
        </div>
      </div>
    </div>
  );
}