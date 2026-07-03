import { ArrowLeft, Coffee, Clock, Moon, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getCaffeineTips } from "../services/caffeineService";
import { getCaffeineGuide } from "../services/caffeineGuideService";
import { getPreWorkout } from "../services/preWorkoutService";
import { getCaffeineReference } from "../services/caffeineReferenceService";
export function CaffeinePage() {
  const navigate = useNavigate();
const [tips, setTips] = useState<any[]>([]);
const [guide, setGuide] = useState<any[]>([]);
const [preWorkout, setPreWorkout] = useState<any[]>([]);
const [reference, setReference] = useState<any[]>([]);
const tipColors = [
  "bg-pink-100",
  "bg-sky-100",
  "bg-green-100",
  "bg-amber-100",
];
const sectionColors = {
  tips: "bg-gradient-to-br from-pink-50 to-rose-100",
  guide: "bg-gradient-to-br from-sky-50 to-cyan-100",
  preWorkout: "bg-gradient-to-br from-amber-50 to-yellow-100",
  reference: "bg-gradient-to-br from-emerald-50 to-green-100",
};



useEffect(() => {
  loadData();
}, []);
console.log(import.meta.env.VITE_API_URL);

const loadData = async () => {
  try {
    const tipsData = await getCaffeineTips();
    const guideData = await getCaffeineGuide();
    const preData = await getPreWorkout();
    const referenceData = await getCaffeineReference();
console.log(import.meta.env.VITE_API_URL);

console.log(guideData);
    console.log("Tips", tipsData);
    console.log("Guide", guideData);
    console.log("Pre Workout", preData);
    console.log("Reference", referenceData);

    setTips(tipsData);
    setGuide(guideData);
    setPreWorkout(preData);
    setReference(referenceData);
  } catch (error) {
    console.log(error);
  }
};
  return (
    <div className="min-h-screen p-4 md:p-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/sports')}
          className="flex items-center gap-2 text-sky-600 hover:text-sky-900 mb-4 transition-colors"
          title="Back to Sports Dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-sky-900 mb-2">Caffeine Tips</h1>
        <p className="text-sky-600">Manage your energy and optimize performance</p>
      </div>

      {/* Main Tips */}
      <div className="mb-8">
        <h2 className="text-sky-900 mb-6">Essential Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip, index) => {

            const Icon = tip.icon;
            return (
              <div
                key={index}
                className={`${tipColors[index % tipColors.length]} rounded-3xl p-6 shadow-sm`}
>
              
                <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
  <Coffee className="w-7 h-7 text-amber-600" />
</div>
                  <div className="flex-1">
                    <h3 className="text-sky-900 mb-2">{tip.title}</h3>
                    <p className="text-sm text-sky-600 mb-3">{tip.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dosage Guide */}
      <div className="mb-8">
        <h2 className="text-sky-900 mb-6">Daily Caffeine Guide</h2>
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-sky-600 mb-6">
            Recommended daily limit for adults: <strong className="text-sky-900">400mg</strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {guide.map((item, index) => (
              <div
                key={index}
                className={`${sectionColors.guide} rounded-2xl p-4`}
                title={`${item.range} of caffeine`}
              >
                <p className="text-sky-900 mb-1">{item.amount}</p>
                <p className="text-sm text-sky-600 mb-2">{item.level}</p>
                <p className="text-xs text-sky-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pre-Workout Caffeine */}
      <div className="bg-white rounded-3xl p-6 shadow-sm mb-8">
        <h2 className="text-sky-900 mb-4">Pre-Workout Caffeine</h2>
        <div className="space-y-4">
         <div className={`${sectionColors.preWorkout} p-4 rounded-2xl`}>
            {preWorkout.map((item, index) => (
  <div
    key={index}
    className={`${sectionColors.preWorkout} p-4 rounded-2xl ${
      item.type === "Good" ? "bg-sky-50" : "bg-orange-50"
    }`}
  >
    <p className="text-sky-900 mb-2">
      {item.type === "Good" ? "✅" : "⚠️"}{" "}
      <strong>{item.title}</strong>: {item.time}
    </p>

    <p className="text-sm text-sky-600">
      {item.description}
    </p>
  </div>
))}
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-3xl p-6 w-100  m-auto">
        <h3 className="text-sky-900 mb-4 ">Quick Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reference.map((item, index) => (
  <div key={index} className="flex items-start gap-2">
    <span className="text-2xl">{item.icon}</span>

    <div>
      <p className="text-sm text-sky-900">
        {item.name}
      </p>

      <p className="text-xs text-sky-600">
        {item.amount}
      </p>
    </div>
  </div>
))}
        </div>
      </div>
    </div>
  );
}
