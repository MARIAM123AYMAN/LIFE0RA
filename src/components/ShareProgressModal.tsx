import { useState } from 'react';
import { X, Link2, Download, Share2, Copy, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface ShareProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareProgressModal({ isOpen, onClose }: ShareProgressModalProps) {
  const { language } = useApp();
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  if (!isOpen) return null;

  const generateShareLink = () => {
    // Get user data
    const userName = localStorage.getItem('userName') || 'User';
    const waterCups = parseInt(localStorage.getItem('waterCups') || '0');
    const dailyCalories = parseInt(localStorage.getItem('dailyCalories') || '0');
    const dailyWaterGoal = parseInt(localStorage.getItem('dailyWaterGoal') || '2000');
    const dailyCalorieGoal = parseInt(localStorage.getItem('dailyCalorieGoal') || '2000');
    const dailyStepsGoal = parseInt(localStorage.getItem('dailyStepsGoal') || '10000');
    
    // Calculate averages from workout history
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const totalMinutes = workoutHistory.reduce((sum: number, w: any) => sum + w.duration, 0);
    const avgCardio = workoutHistory.length > 0 ? Math.round(totalMinutes / 7) : 0;
    
    // Create share data
    const shareData = {
      name: userName,
      waterGoal: dailyWaterGoal,
      calorieGoal: dailyCalorieGoal,
      stepsGoal: dailyStepsGoal,
      avgWater: waterCups * 250,
      avgCalories: dailyCalories,
      avgCardio: avgCardio,
      date: new Date().toISOString().split('T')[0]
    };

    // Encode as base64
    const encodedData = btoa(JSON.stringify(shareData));
    const url = `${window.location.origin}/share/${encodedData}`;
    setShareUrl(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    // Get user data
    const userName = localStorage.getItem('userName') || 'User';
    const dailyWaterGoal = parseInt(localStorage.getItem('dailyWaterGoal') || '2000');
    const dailyCalorieGoal = parseInt(localStorage.getItem('dailyCalorieGoal') || '2000');
    const dailyStepsGoal = parseInt(localStorage.getItem('dailyStepsGoal') || '10000');
    const dailyCardioGoal = parseInt(localStorage.getItem('dailyCardioGoal') || '30');
    const waterCups = parseInt(localStorage.getItem('waterCups') || '0');
    const dailyCalories = parseInt(localStorage.getItem('dailyCalories') || '0');
    
    // Calculate averages
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const totalMinutes = workoutHistory.reduce((sum: number, w: any) => sum + w.duration, 0);
    const avgCardio = workoutHistory.length > 0 ? Math.round(totalMinutes / 7) : 0;
    const avgSteps = dailyStepsGoal * 0.7; // Simulated average
    
    // Create simple HTML content for PDF
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${language === 'en' ? 'Balance Life Progress Report' : 'تقرير تقدم حياة متوازنة'}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            color: #0c4a6e;
          }
          h1 {
            color: #0ea5e9;
            text-align: center;
            margin-bottom: 30px;
          }
          .section {
            background: #f0f9ff;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .goal {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #bae6fd;
          }
          .goal:last-child {
            border-bottom: none;
          }
          .label {
            font-weight: bold;
          }
          .value {
            color: #0369a1;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            color: #64748b;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <h1>${language === 'en' ? '🌟 Balance Life Progress Report' : '🌟 تقرير تقدم حياة متوازنة'}</h1>
        
        <div class="section">
          <h2>${language === 'en' ? '👤 User Profile' : '👤 الملف الشخصي'}</h2>
          <div class="goal">
            <span class="label">${language === 'en' ? 'Name:' : 'الاسم:'}</span>
            <span class="value">${userName}</span>
          </div>
          <div class="goal">
            <span class="label">${language === 'en' ? 'Report Date:' : 'تاريخ التقرير:'}</span>
            <span class="value">${new Date().toLocaleDateString()}</span>
          </div>
        </div>
        
        <div class="section">
          <h2>${language === 'en' ? '🎯 Daily Goals' : '🎯 الأهداف اليومية'}</h2>
          <div class="goal">
            <span class="label">${language === 'en' ? 'Water Goal:' : 'هدف الماء:'}</span>
            <span class="value">${dailyWaterGoal} ml</span>
          </div>
          <div class="goal">
            <span class="label">${language === 'en' ? 'Calorie Goal:' : 'هدف السعرات:'}</span>
            <span class="value">${dailyCalorieGoal} kcal</span>
          </div>
          <div class="goal">
            <span class="label">${language === 'en' ? 'Steps Goal:' : 'هدف الخطوات:'}</span>
            <span class="value">${dailyStepsGoal.toLocaleString()} steps</span>
          </div>
          <div class="goal">
            <span class="label">${language === 'en' ? 'Cardio Goal:' : 'هدف الكارديو:'}</span>
            <span class="value">${dailyCardioGoal} min</span>
          </div>
        </div>
        
        <div class="section">
          <h2>${language === 'en' ? '📊 Current Averages (7 days)' : '📊 المتوسطات الحالية (7 أيام)'}</h2>
          <div class="goal">
            <span class="label">${language === 'en' ? 'Average Water:' : 'متوسط الماء:'}</span>
            <span class="value">${waterCups * 250} ml / ${dailyWaterGoal} ml</span>
          </div>
          <div class="goal">
            <span class="label">${language === 'en' ? 'Average Calories:' : 'متوسط السعرات:'}</span>
            <span class="value">${dailyCalories} kcal / ${dailyCalorieGoal} kcal</span>
          </div>
          <div class="goal">
            <span class="label">${language === 'en' ? 'Average Steps:' : 'متوسط الخطوات:'}</span>
            <span class="value">${Math.round(avgSteps).toLocaleString()} steps / ${dailyStepsGoal.toLocaleString()} steps</span>
          </div>
          <div class="goal">
            <span class="label">${language === 'en' ? 'Average Cardio:' : 'متوسط الكارديو:'}</span>
            <span class="value">${avgCardio} min / ${dailyCardioGoal} min</span>
          </div>
        </div>
        
        <div class="footer">
          ${language === 'en' ? 'Generated by Balance Life App' : 'تم الإنشاء بواسطة تطبيق حياة متوازنة'}
        </div>
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `balance-life-progress-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h2 className="text-sky-900 dark:text-sky-100">
                {language === 'en' ? 'Share Progress' : 'مشاركة التقدم'}
              </h2>
              <p className="text-sm text-sky-600 dark:text-sky-400">
                {language === 'en' ? 'Share your achievements' : 'شارك إنجازاتك'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900 hover:bg-sky-200 dark:hover:bg-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {/* Generate Link */}
          <button
            onClick={generateShareLink}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-sky-50 dark:bg-sky-900/50 hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-800 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sky-900 dark:text-sky-100">
                {language === 'en' ? 'Generate Share Link' : 'إنشاء رابط مشاركة'}
              </p>
              <p className="text-xs text-sky-600 dark:text-sky-400">
                {language === 'en' ? 'Create a shareable link' : 'إنشاء رابط قابل للمشاركة'}
              </p>
            </div>
          </button>

          {/* Show generated link */}
          {shareUrl && (
            <div className="p-4 rounded-2xl bg-mint-50 dark:bg-mint-900/20 border border-mint-200 dark:border-mint-800">
              <p className="text-xs text-mint-700 dark:text-mint-400 mb-2">
                {language === 'en' ? 'Share Link:' : 'رابط المشاركة:'}
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-mint-200 dark:border-mint-700 text-xs text-sky-900 dark:text-sky-100"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 rounded-xl bg-mint-600 dark:bg-mint-700 hover:bg-mint-700 dark:hover:bg-mint-600 text-white transition-colors flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="text-xs">{copied ? (language === 'en' ? 'Copied!' : 'تم النسخ!') : (language === 'en' ? 'Copy' : 'نسخ')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Download PDF */}
          <button
            onClick={downloadPDF}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/50 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
              <Download className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sky-900 dark:text-sky-100">
                {language === 'en' ? 'Download Report' : 'تحميل التقرير'}
              </p>
              <p className="text-xs text-sky-600 dark:text-sky-400">
                {language === 'en' ? 'Download as HTML file' : 'تحميل كملف HTML'}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
