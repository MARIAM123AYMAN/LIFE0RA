import { PieChart, Pie, Cell, ResponsiveContainer, RadialBarChart, RadialBar, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useApp } from '../contexts/AppContext';
import { t } from '../utils/translations';
interface NutritionChartsProps {
  totalCalories: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  timelineData: any[];
}

export function NutritionCharts({
  totalCalories,
  targetCalories,
  protein,
  carbs,
  fats,
  timelineData,
}: NutritionChartsProps) {
  const { language } = useApp();
  // Data for macros pie chart
  const macrosData = [
    { name: t('protein', language), value: protein, color: '#0ea5e9' },
    { name: t('carbs', language), value: carbs, color: '#10b981' },
    { name: t('fats', language), value: fats, color: '#a855f7' },
  ];

  // Data for calories radial chart
  const caloriesData = [
    {
      name: 'Calories',
      value: totalCalories,
      fill: '#0ea5e9',
    },
  ];

  // Mock timeline data


  const percentage = Math.round((totalCalories / targetCalories) * 100);

  return (
    <div className="space-y-6">
      {/* Calories Progress Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h3 className="text-sky-900 mb-6">Calories Progress</h3>
        <div className="relative">
          <ResponsiveContainer width="100%" height={250}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              barSize={20}
              data={caloriesData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                background
                dataKey="value"
                cornerRadius={10}
                fill="#0ea5e9"
                max={targetCalories}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl text-sky-900 mb-1">{percentage}%</p>
              <p className="text-sm text-sky-600">{t("ofTarget", language)}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-sky-600">
            {totalCalories} / {targetCalories} kcal
          </p>
        </div>
      </div>

      {/* Macros Distribution Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h3 className="text-sky-900 mb-6">Macros Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              label
              data={macrosData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {macrosData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-4 mt-6">
          {macrosData.map((macro, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: macro.color }}
                />
                <p className="text-sm text-sky-600">{macro.name}</p>
              </div>
              <p className="text-sky-900">{macro.value}g</p>
            </div>
          ))}
        </div>
      </div>

      {/* Calories Timeline */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h3 className="text-sky-900 mb-6">Today's Timeline</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
            <XAxis
              dataKey="meal"
              stroke="#0ea5e9"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#0ea5e9" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0f2fe',
                borderRadius: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={{ fill: '#0ea5e9', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
