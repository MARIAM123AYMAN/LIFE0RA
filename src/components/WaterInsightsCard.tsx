import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface WaterLog {
  id: number;
  amount: number;
  time: string;
  timestamp: number;
  date: string;
}

interface WaterInsightsCardProps {
  apiKey: string;
  currentIntake: number;
  targetIntake: number;
  logs: WaterLog[];
  selectedDate: string;
}

export function WaterInsightsCard({
  apiKey,
  currentIntake,
  targetIntake,
  logs,
  selectedDate,
}: WaterInsightsCardProps) {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchInsight = async () => {
    if (!apiKey) return;

    setLoading(true);
    setError('');

    try {
      const percentage = Math.round((currentIntake / targetIntake) * 100);
      const logsCount = logs.length;
      const avgIntake = logsCount > 0 ? Math.round(currentIntake / logsCount) : 0;

      const prompt = `You are a hydration and wellness expert. Based on the following water intake data for ${selectedDate}, provide a brief, encouraging insight (2-3 sentences max):

Current intake: ${currentIntake}ml out of ${targetIntake}ml goal (${percentage}%)
Number of water logs: ${logsCount}
Average per intake: ${avgIntake}ml

Provide personalized advice, encouragement, or health tips about hydration. Keep it positive and actionable.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 150,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch insights from Gemini API');
      }

      const data = await response.json();
      const generatedText = data.candidates[0]?.content?.parts[0]?.text || 'No insight available';
      
      setInsight(generatedText);
    } catch (err) {
      setError('Unable to fetch insights. Please check your API key.');
      console.error('Gemini API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch insights when data changes
    if (apiKey && currentIntake >= 0) {
      fetchInsight();
    }
  }, [selectedDate, currentIntake]);

  if (!apiKey) return null;

  return (
    <div className="bg-gradient-to-br from-sky-50 to-white rounded-xl p-6 shadow-md border border-sky-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-sky-900">AI Insights</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-sky-600 animate-spin" />
          <span className="ml-2 text-sky-600">Analyzing your hydration...</span>
        </div>
      ) : error ? (
        <div className="flex items-start gap-2 text-red-600">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      ) : insight ? (
        <div>
          <p className="text-sky-700 leading-relaxed">{insight}</p>
          <button
            onClick={fetchInsight}
            className="mt-4 text-sm text-sky-600 hover:text-sky-700 transition-colors"
          >
            Refresh Insight
          </button>
        </div>
      ) : (
        <p className="text-sky-600">Start logging water to get personalized insights!</p>
      )}
    </div>
  );
}
