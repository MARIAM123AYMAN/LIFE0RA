// Notification utility to trigger notifications across the app
export interface NotificationData {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  module: 'meals' | 'water' | 'sports' | 'general';
  message: string;
  timestamp: number;
}

export const showNotification = (notification: Omit<NotificationData, 'id' | 'timestamp'>) => {
  const id = `${notification.module}-${Date.now()}-${Math.random()}`;
  const notificationWithId: NotificationData = {
    ...notification,
    id,
    timestamp: Date.now(),
  };

  // Store in localStorage to be picked up by GlobalNotificationSystem
  const existing = JSON.parse(localStorage.getItem('pendingNotifications') || '[]');
  localStorage.setItem('pendingNotifications', JSON.stringify([...existing, notificationWithId]));

  // Trigger storage event for cross-component communication
  window.dispatchEvent(new Event('notification'));
};

// Predefined notification templates
export const notifications = {
  // Meals notifications
  mealAdded: (mealName: string, calories: number) =>
    showNotification({
      type: 'success',
      module: 'meals',
      message: `✅ ${mealName} added (${calories} kcal)`,
    }),

  mealDeleted: (mealName: string) =>
    showNotification({
      type: 'info',
      module: 'meals',
      message: `🗑️ ${mealName} removed from your meals`,
    }),

  calorieGoalReached: () =>
    showNotification({
      type: 'warning',
      module: 'meals',
      message: '⚠️ You\'ve reached your daily calorie goal!',
    }),

  calorieGoalExceeded: () =>
    showNotification({
      type: 'warning',
      module: 'meals',
      message: '⚠️ You\'ve exceeded your daily calorie goal!',
    }),

  foodScanned: (foodName: string) =>
    showNotification({
      type: 'success',
      module: 'meals',
      message: `📸 ${foodName} identified! Check nutrition details.`,
    }),

  // Water notifications
  waterAdded: (amount: number) =>
    showNotification({
      type: 'success',
      module: 'water',
      message: `💧 ${amount} cup${amount > 1 ? 's' : ''} of water logged!`,
    }),

  waterGoalReached: () =>
    showNotification({
      type: 'success',
      module: 'water',
      message: '🎉 Daily water goal achieved! Great job!',
    }),

  waterGoalHalfway: () =>
    showNotification({
      type: 'info',
      module: 'water',
      message: '💪 Halfway to your water goal! Keep going!',
    }),

  hydrationTip: (tip: string) =>
    showNotification({
      type: 'info',
      module: 'water',
      message: `💡 Hydration Tip: ${tip}`,
    }),

  // Sports notifications
  workoutStarted: (workoutName: string) =>
    showNotification({
      type: 'success',
      module: 'sports',
      message: `🏃 ${workoutName} started! Good luck!`,
    }),

  workoutCompleted: (workoutName: string, duration: number) =>
    showNotification({
      type: 'success',
      module: 'sports',
      message: `🎉 ${workoutName} completed in ${duration} minutes!`,
    }),

  goalSet: (goalName: string) =>
    showNotification({
      type: 'success',
      module: 'sports',
      message: `🎯 Goal set: ${goalName}. Let's achieve it!`,
    }),

  stepsGoalReached: (steps: number) =>
    showNotification({
      type: 'success',
      module: 'sports',
      message: `🎉 ${steps} steps reached! You did it!`,
    }),

  breathingStarted: () =>
    showNotification({
      type: 'info',
      module: 'sports',
      message: '🧘 Breathing exercise started. Relax and focus.',
    }),

  breathingCompleted: () =>
    showNotification({
      type: 'success',
      module: 'sports',
      message: '✅ Breathing exercise completed. Feel refreshed!',
    }),

  timerStarted: (activity: string) =>
    showNotification({
      type: 'info',
      module: 'sports',
      message: `⏱️ ${activity} timer started!`,
    }),

  timerCompleted: (activity: string) =>
    showNotification({
      type: 'success',
      module: 'sports',
      message: `✅ ${activity} completed!`,
    }),

  // General notifications
  settingsSaved: () =>
    showNotification({
      type: 'success',
      module: 'general',
      message: '✅ Settings saved successfully!',
    }),

  error: (message: string) =>
    showNotification({
      type: 'error',
      module: 'general',
      message: `❌ ${message}`,
    }),
};
