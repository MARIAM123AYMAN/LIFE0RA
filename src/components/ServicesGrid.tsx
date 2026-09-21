import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  MessageCircle, 
  Timer, 
  Footprints, 
  MapPin, 
  Video, 
  Wind, 
  Coffee 
} from 'lucide-react';

interface ServicesGridProps {
  goal: string;
}

export function ServicesGrid({ goal }: ServicesGridProps) {
  const services = [
    {
      id: 'workouts',
      icon: Dumbbell,
      title: 'Workouts',
      description: 'Browse workout plans',
      path: '/sports/workouts',
      color: 'bg-sky-100',
      iconColor: 'text-sky-600',
      tooltip: 'Access cardio, strength, and home workout plans',
    },
    // {
    //   id: 'ai-coach',
    //   icon: MessageCircle,
    //   title: 'AI Coach',
    //   description: 'Chat with smart coach',
    //   path: '/sports/chatBot',
    //   color: 'bg-purple-100',
    //   iconColor: 'text-purple-600',
    //   tooltip: 'Click the floating chat button to talk with AI coach',
    // },
    {
      id: 'timer',
      icon: Timer,
      title: 'Activity Timer',
      description: 'Track workout time',
      path: '/sports/timer',
      color: 'bg-amber-100',
      iconColor: 'text-amber-600',
      tooltip: 'Use the workout timer to track your active time',
    },
    {
      id: 'steps',
      icon: Footprints,
      title: 'Steps Counter',
      description: 'Daily step tracking',
      path: '/sports/steps',
      color: 'bg-mint-100',
      iconColor: 'text-mint-600',
      tooltip: 'Monitor your daily steps and walking activity',
    },
    {
      id: 'gyms',
      icon: MapPin,
      title: 'Nearby Gyms',
      description: 'Find gyms near you',
      path: '/sports/gyms',
      color: 'bg-red-100',
      iconColor: 'text-red-600',
      tooltip: 'Discover gyms and fitness centers in your area',
    },
    {
      id: 'videos',
      icon: Video,
      title: 'Workout Videos',
      description: 'Video tutorials',
      path: '/sports/videos',
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
      tooltip: 'Watch guided workout videos and playlists',
    },
    {
      id: 'breathing',
      icon: Wind,
      title: 'Breathing Exercises',
      description: 'Relax and recover',
      path: '/sports/breathing',
      color: 'bg-teal-100',
      iconColor: 'text-teal-600',
      tooltip: 'Practice breathing techniques for stress relief',
    },
    {
      id: 'caffeine',
      icon: Coffee,
      title: 'Caffeine Tips',
      description: 'Energy management',
      path: '/sports/caffeine',
      color: 'bg-orange-100',
      iconColor: 'text-orange-600',
      tooltip: 'Learn how caffeine affects your training and sleep',
    },
  ];


  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-sky-900">Sports Services</h2>
        <p className="text-sm text-sky-600">Choose a service to get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Link
              key={service.id}
              to={service.path}
              className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all"
              title={service.tooltip}
            >
              <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-7 h-7 ${service.iconColor}`} />
              </div>
              <h3 className="text-sky-900 mb-2">{service.title}</h3>
              <p className="text-sm text-sky-600">{service.description}</p>
              
              {/* Hover tooltip indicator */}
              <div className="mt-4 text-xs text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to explore →
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}