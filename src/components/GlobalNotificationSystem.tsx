import { useEffect, useState } from 'react';
import { X, AlertCircle, Droplets, Utensils, Dumbbell, CheckCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  module: 'meals' | 'water' | 'sports' | 'general';
  message: string;
  icon: React.ComponentType<any>;
}

export function GlobalNotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const location = useLocation();

  // Listen for action-based notifications
  useEffect(() => {
    const handleNotification = () => {
      const pending = JSON.parse(localStorage.getItem('pendingNotifications') || '[]');
      
      if (pending.length > 0) {
        const newNotifications = pending.map((n: any) => ({
          id: n.id,
          type: n.type,
          module: n.module,
          message: n.message,
          icon: n.module === 'meals' ? Utensils : n.module === 'water' ? Droplets : n.module === 'sports' ? Dumbbell : CheckCircle,
        }));

        setNotifications(prev => {
          const existingIds = new Set(prev.map(n => n.id));
          const uniqueNew = newNotifications.filter((n: Notification) => !existingIds.has(n.id));
          return [...prev, ...uniqueNew].slice(-3); // Keep max 3 notifications
        });

        // Clear pending notifications
        localStorage.removeItem('pendingNotifications');
      }
    };

    // Listen for notification events
    window.addEventListener('notification', handleNotification);
    window.addEventListener('storage', handleNotification);

    return () => {
      window.removeEventListener('notification', handleNotification);
      window.removeEventListener('storage', handleNotification);
    };
  }, []);

  // AI-powered notification logic
  useEffect(() => {
    const checkAndNotify = () => {
      const newNotifications: Notification[] = [];
      const now = new Date();
      const currentHour = now.getHours();

      // Get user data from localStorage
      const waterCups = parseInt(localStorage.getItem('waterCups') || '0');
      const dailyCalories = parseInt(localStorage.getItem('dailyCalories') || '0');
      const lastWorkout = localStorage.getItem('lastWorkout');
      const fitnessGoal = localStorage.getItem('fitnessGoal');

      // Water notifications
      if (waterCups < 4 && currentHour > 12 && !dismissedIds.has('water-low-1')) {
        newNotifications.push({
          id: 'water-low-1',
          type: 'warning',
          module: 'water',
          message: '💧 You\'ve only had ' + waterCups + ' cups of water today. Stay hydrated!',
          icon: Droplets,
        });
      }

      if (waterCups >= 8 && !dismissedIds.has('water-goal-1')) {
        newNotifications.push({
          id: 'water-goal-1',
          type: 'success',
          module: 'water',
          message: '🎉 Great job! You\'ve reached your daily water goal!',
          icon: CheckCircle,
        });
      }

      // Meal notifications
      if (dailyCalories > 2500 && !dismissedIds.has('calories-high-1')) {
        newNotifications.push({
          id: 'calories-high-1',
          type: 'warning',
          module: 'meals',
          message: '⚠️ You\'ve exceeded your recommended daily calorie intake.',
          icon: Utensils,
        });
      }

      if (currentHour === 12 && dailyCalories < 500 && !dismissedIds.has('calories-low-1')) {
        newNotifications.push({
          id: 'calories-low-1',
          type: 'info',
          module: 'meals',
          message: '🍽️ Don\'t forget to have a proper lunch!',
          icon: Utensils,
        });
      }

      // Sports notifications
      if (fitnessGoal && !lastWorkout && currentHour > 16 && !dismissedIds.has('workout-skip-1')) {
        newNotifications.push({
          id: 'workout-skip-1',
          type: 'info',
          module: 'sports',
          message: '🏃 You haven\'t logged a workout today. Time to move!',
          icon: Dumbbell,
        });
      }

      // Evening reminder
      if (currentHour >= 18 && currentHour < 22 && waterCups < 6 && !dismissedIds.has('evening-water-1')) {
        newNotifications.push({
          id: 'evening-water-1',
          type: 'info',
          module: 'water',
          message: '🌙 Evening reminder: Drink water before dinner.',
          icon: Droplets,
        });
      }

      // Show only notifications that haven't been dismissed
      const filteredNotifications = newNotifications.filter(
        n => !dismissedIds.has(n.id)
      );

      if (filteredNotifications.length > 0) {
        setNotifications(prev => {
          // Avoid duplicates
          const existingIds = new Set(prev.map(n => n.id));
          const uniqueNew = filteredNotifications.filter(n => !existingIds.has(n.id));
          return [...prev, ...uniqueNew].slice(-3); // Keep max 3 notifications
        });
      }
    };

    // Check immediately
    checkAndNotify();

    // Check every 30 seconds
    const interval = setInterval(checkAndNotify, 30000);

    return () => clearInterval(interval);
  }, [dismissedIds, location]);

  const dismissNotification = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-teal-50 border-teal-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-sky-50 border-sky-200';
    }
  };

  const getIconColor = (module: Notification['module']) => {
    switch (module) {
      case 'meals':
        return 'text-orange-600';
      case 'water':
        return 'text-sky-600';
      case 'sports':
        return 'text-purple-600';
      default:
        return 'text-sky-600';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 max-w-md w-full mx-4 z-50 space-y-3">
      {notifications.map((notification, index) => {
        const Icon = notification.icon;
        return (
          <div
            key={notification.id}
            className={`${getTypeStyles(notification.type)} border rounded-2xl p-4 shadow-lg animate-slide-up`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 ${getIconColor(notification.module)}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-sky-900">{notification.message}</p>
              </div>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="w-8 h-8 rounded-lg bg-white hover:bg-sky-100 flex items-center justify-center text-sky-600 transition-colors flex-shrink-0"
                title="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}