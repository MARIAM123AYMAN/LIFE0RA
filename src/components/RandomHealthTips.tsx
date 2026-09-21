import { useEffect, useState } from 'react';
import { Lightbulb, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const healthTips = {
  en: {
    general: [
      "💧 Drink a glass of water first thing in the morning to kickstart your metabolism.",
      "🥗 Include colorful vegetables in every meal for maximum nutrients.",
      "🚶 Take a 10-minute walk after meals to aid digestion.",
      "😴 Aim for 7-9 hours of quality sleep each night.",
      "🧘 Practice deep breathing for 5 minutes daily to reduce stress.",
      "📱 Take regular breaks from screens to rest your eyes.",
      "🌞 Get sunlight exposure daily for vitamin D.",
      "🥜 Include protein in every meal to stay full longer.",
    ],
    weightLoss: [
      "🎯 Set realistic fitness goals and track your progress.",
      "🥤 Limit sugary drinks and opt for water or herbal tea.",
      "🍎 Keep healthy snacks nearby to avoid unhealthy choices.",
      "🏃 Mix cardio with strength training for balanced fitness.",
      "⏰ Eat at consistent times to regulate your metabolism.",
      "🥦 Meal prep on Sundays to eat healthy all week.",
    ],
    muscleGain: [
      "💪 Ensure adequate protein intake (1.6-2.2g per kg body weight).",
      "🏋️ Progressive overload is key - gradually increase weights.",
      "😴 Muscle growth happens during rest - don't skip recovery days.",
      "🥚 Eat protein within 2 hours after workout for optimal recovery.",
      "🔥 Compound exercises build muscle faster than isolation moves.",
    ],
    stayFit: [
      "🚴 Try different activities to keep workouts interesting.",
      "🧘‍♀️ Stretch for 5-10 minutes daily to improve flexibility.",
      "💪 Rest days are crucial for muscle recovery.",
      "🎾 Mix fun sports with structured workouts.",
      "🏊 Swimming is a great low-impact full-body workout.",
    ],
    diabetes: [
      "🩸 Monitor your blood sugar levels regularly.",
      "🥗 Choose complex carbs over simple sugars.",
      "🚶 Regular physical activity helps control blood sugar.",
      "⏰ Eat meals at consistent times each day.",
      "💊 Take medications as prescribed by your doctor.",
    ],
    heartDisease: [
      "❤️ Reduce sodium intake to manage blood pressure.",
      "🥑 Include heart-healthy fats like omega-3s.",
      "🚫 Avoid trans fats and excessive saturated fats.",
      "🧘 Manage stress through meditation or yoga.",
      "🚶 Moderate daily exercise strengthens your heart.",
    ],
    highBloodPressure: [
      "🧂 Reduce salt intake - aim for less than 2,300mg daily.",
      "🍌 Potassium-rich foods help lower blood pressure.",
      "🍷 Limit alcohol consumption.",
      "☕ Monitor caffeine intake as it can raise blood pressure.",
      "😌 Practice relaxation techniques to manage stress.",
    ],
  },
  ar: {
    general: [
      "💧 اشرب كوباً من الماء أول شيء في الصباح لتنشيط عملية الأيض.",
      "🥗 أضف خضروات ملونة في كل وجبة للحصول على أقصى قدر من العناصر الغذائية.",
      "🚶 امشِ لمدة 10 دقائق بعد الوجبات للمساعدة في الهضم.",
      "😴 اهدف للحصول على 7-9 ساعات من النوم الجيد كل ليلة.",
      "🧘 مارس التنفس العميق لمدة 5 دقائق يومياً لتقليل التوتر.",
      "📱 خذ فترات راحة منتظمة من الشاشات لإراحة عينيك.",
      "🌞 احصل على التعرض لأشعة الشمس يومياً لفيتامين د.",
      "🥜 أضف البروتين في كل وجبة لتبقى ممتلئاً لفترة أطول.",
    ],
    weightLoss: [
      "🎯 ضع أهداف لياقة واقعية وتتبع تقدمك.",
      "🥤 قلل من المشروبات السكرية واختر الماء أو شاي الأعشاب.",
      "🍎 احتفظ بوجبات خفيفة صحية قريبة لتجنب الخيارات غير الصحية.",
      "🏃 امزج تمارين الكارديو مع تمارين القوة للياقة متوازنة.",
      "⏰ تناول الطعام في أوقات ثابتة لتنظيم عملية الأيض.",
      "🥦 حضّر الوجبات يوم الأحد لتأكل صحياً طوال الأسبوع.",
    ],
    muscleGain: [
      "💪 تأكد من تناول كمية كافية من البروتين (1.6-2.2 جم لكل كجم من وزن الجسم).",
      "🏋️ الزيادة التدريجية للأوزان مفتاح بناء العضلات.",
      "😴 نمو العضلات يحدث أثناء الراحة - لا تتخطى أيام التعافي.",
      "🥚 تناول البروتين خلال ساعتين بعد التمرين للتعافي الأمثل.",
      "🔥 التمارين المركبة تبني العضلات أسرع من التمارين المنعزلة.",
    ],
    stayFit: [
      "🚴 جرب أنشطة مختلفة للحفاظ على التمارين ممتعة.",
      "🧘‍♀️ تمدد لمدة 5-10 دقائق يومياً لتحسين المرونة.",
      "💪 أيام الراحة ضرورية لتعافي العضلات.",
      "🎾 امزج الرياضات الممتعة مع التمارين المنظمة.",
      "🏊 السباحة تمرين رائع منخفض التأثير لكامل الجسم.",
    ],
    diabetes: [
      "🩸 راقب مستويات السكر في الدم بانتظام.",
      "🥗 اختر الكربوهيدرات المعقدة بدلاً من السكريات البسيطة.",
      "🚶 النشاط البدني المنتظم يساعد في التحكم بسكر الدم.",
      "⏰ تناول الوجبات في أوقات ثابتة كل يوم.",
      "💊 تناول الأدوية كما وصفها طبيبك.",
    ],
    heartDisease: [
      "❤️ قلل من تناول الصوديوم للسيطرة على ضغط الدم.",
      "🥑 أضف الدهون الصحية للقلب مثل أوميغا 3.",
      "🚫 تجنب الدهون المتحولة والدهون المشبعة الزائدة.",
      "🧘 تحكم في التوتر من خلال التأمل أو اليوغا.",
      "🚶 التمارين اليومية المعتدلة تقوي قلبك.",
    ],
    highBloodPressure: [
      "🧂 قلل من تناول الملح - اهدف لأقل من 2,300 ملغ يومياً.",
      "🍌 الأطعمة الغنية بالبوتاسيوم تساعد في خفض ضغط الدم.",
      "🍷 قلل من استهلاك الكحول.",
      "☕ راقب تناول الكافيين لأنه يمكن أن يرفع ضغط الدم.",
      "😌 مارس تقنيات الاسترخاء للتحكم في التوتر.",
    ],
  }
};

export function RandomHealthTips() {
  const { language } = useApp();
  const [currentTip, setCurrentTip] = useState<string>('');
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const getRandomTip = () => {
      // Get user's health data from onboarding
      const healthConditions = JSON.parse(localStorage.getItem('userHealthConditions') || '[]');
      const fitnessGoal = localStorage.getItem('userFitnessGoal') || 'stayFit';
      
      const tips = healthTips[language];
      let relevantTips: string[] = [...tips.general];
      
      // Add tips based on fitness goal
      if (fitnessGoal === 'weightLoss' && tips.weightLoss) {
        relevantTips.push(...tips.weightLoss);
      } else if (fitnessGoal === 'muscleGain' && tips.muscleGain) {
        relevantTips.push(...tips.muscleGain);
      } else if (fitnessGoal === 'stayFit' && tips.stayFit) {
        relevantTips.push(...tips.stayFit);
      }
      
      // Add tips based on health conditions
      if (healthConditions.includes('diabetes') && tips.diabetes) {
        relevantTips.push(...tips.diabetes);
      }
      if (healthConditions.includes('heartDisease') && tips.heartDisease) {
        relevantTips.push(...tips.heartDisease);
      }
      if (healthConditions.includes('highBloodPressure') && tips.highBloodPressure) {
        relevantTips.push(...tips.highBloodPressure);
      }
      
      const randomIndex = Math.floor(Math.random() * relevantTips.length);
      return relevantTips[randomIndex];
    };

    const showRandomTip = () => {
      // Random interval between 3-8 minutes
      const randomDelay = 20 * 1000; // كل دقيقة
      setTimeout(() => {
        setCurrentTip(getRandomTip());
        setShowTip(true);
        
        // Auto-hide after 15 seconds
        setTimeout(() => {
          setShowTip(false);
        }, 15000);
        
        // Schedule next tip
        showRandomTip();
      }, randomDelay);
    };

    // Show first tip after 2 minutes
    const initialTimeout = setTimeout(() => {
      setCurrentTip(getRandomTip());
      setShowTip(true);
      
      setTimeout(() => {
        setShowTip(false);
      }, 15000);
      
      showRandomTip();
    }, 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
    };
  }, [language]);

  if (!showTip) return null;

  return (
    <div className="fixed top-20 right-4 md:right-8 max-w-sm w-full mx-4 md:mx-0 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-mint-100 to-sky-100 dark:from-mint-900 dark:to-sky-900 border border-mint-200 dark:border-mint-700 rounded-2xl p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-mint-600 dark:text-mint-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-sky-900 dark:text-sky-100 mb-1">
              {language === 'en' ? 'Health Tip' : 'نصيحة صحية'}
            </h4>
            <p className="text-sm text-sky-700 dark:text-sky-300">{currentTip}</p>
          </div>
          <button
            onClick={() => setShowTip(false)}
            className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 hover:bg-sky-50 dark:hover:bg-gray-700 flex items-center justify-center text-sky-600 dark:text-sky-400 transition-colors flex-shrink-0"
            title={language === 'en' ? 'Dismiss' : 'إغلاق'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}