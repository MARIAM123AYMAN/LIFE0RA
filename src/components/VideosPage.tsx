import { ArrowLeft, Play, Clock, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getWorkoutVideos } from "../services/workoutVideoService";
import { getOnboardingResult } from "../services/onboardingService";
export function VideosPage() {
  const navigate = useNavigate();
const [currentGoal, setCurrentGoal] = useState("");

  const [videos, setVideos] = useState<any[]>([]);
useEffect(() => {
  loadVideos();
}, []);
const getYoutubeThumbnail = (url: string) => {
  const videoId = url.split("v=")[1]?.split("&")[0];

  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};
const loadVideos = async () => {
  try {
     const profile = await getOnboardingResult();
  setCurrentGoal(profile.goal);
    const data = await getWorkoutVideos();

    console.log("Videos =", data);

    const allVideos = await getWorkoutVideos();
  setVideos(allVideos);
  } catch (err) {
    console.log(err);
  }
};
// if data in back goals is added##############################
// const filteredVideos = videos.filter(
//   (video: any) => video.goal === currentGoal
// );

const filteredVideos = videos.filter((video: any) => {
  if (currentGoal === "Lose Weight") {
    return (
      video.title.toLowerCase().includes("fat") ||
      video.title.toLowerCase().includes("cardio") ||
      video.title.toLowerCase().includes("hiit") ||
      video.title.toLowerCase().includes("running")
    );
  }

  if (currentGoal === "Gain Muscle") {
    return (
      video.title.toLowerCase().includes("strength") ||
      video.title.toLowerCase().includes("upper") ||
      video.title.toLowerCase().includes("lower") ||
      video.title.toLowerCase().includes("abs")
    );
  }

  if (currentGoal === "Reduce Stress") {
    return (
      video.title.toLowerCase().includes("yoga") ||
      video.title.toLowerCase().includes("stretch") ||
      video.title.toLowerCase().includes("mobility") ||
      video.title.toLowerCase().includes("pilates")
    );
  }

  return true;
});
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-teal-100 text-teal-600';
      case 'Intermediate':
        return 'bg-sky-100 text-sky-600';
      case 'Advanced':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-sky-100 text-sky-600';
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
        <h1 className="text-sky-900 mb-2">Workout Videos</h1>
        <p className="text-sky-600">
          Recommended for your goal: <strong>{currentGoal}</strong>
        </p>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredVideos.map((video: any) => (
          <div
          key={video.id}
          onClick={() => window.open(video.videoUrl, "_blank")}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="relative w-full h-48">
  <img
    src={getYoutubeThumbnail(video.videoUrl)}
    alt={video.title}
    className="w-full h-full object-cover"
  />

  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
      <Play className="w-8 h-8 text-red-600 ml-1" />
    </div>
  </div>
</div>

            {/* Video Info */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span 
                  className={`px-3 py-1 rounded-xl text-xs ${getDifficultyColor(video.difficulty)}`}
                  title={`Difficulty level: ${video.difficulty}`}
                >
                  {video.difficulty}
                </span>
              </div>

              <h3 className="text-sky-900 mb-2">{video.title}</h3>
              <p className="text-sm text-sky-600 mb-4">with {video.trainer}</p>

              <div className="flex items-center justify-between text-sm text-sky-600">
                <div className="flex items-center gap-1" title="Video duration">
                  <Clock className="w-4 h-4" />
                  <span>{video.duration} min</span>
                </div>
                <div className="flex items-center gap-1" title="Estimated calories burned">
                  <Flame className="w-4 h-4" />
                  <span>{video.calories} kcal</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
