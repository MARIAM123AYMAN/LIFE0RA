import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { OnboardingForm } from './components/OnboardingForm';
import { MealsOverview } from './components/MealsOverview';
import { MealDetailsPage } from './components/MealDetailsPage';
import { WaterTrackingPage } from './components/WaterTrackingPage';
import { SportsOverview } from './components/SportsOverview';
import { GoalSelectionPage } from './components/GoalSelectionPage';
import { GymsPage } from './components/GymsPage';
import { VideosPage } from './components/VideosPage';
import { BreathingPage } from './components/BreathingPage';
import { CaffeinePage } from './components/CaffeinePage';
import { WorkoutsPage } from './components/WorkoutsPage';
import { StepsCounterPage } from './components/StepsCounterPage';
import { ActivityTimerPage } from './components/ActivityTimerPage';
import { MainDashboard } from './components/MainDashboard';
import { SettingsPage } from './components/SettingsPage';
import { GlobalNotificationSystem } from './components/GlobalNotificationSystem';
import { RandomHealthTips } from './components/RandomHealthTips';
import { AppProvider } from './contexts/AppContext';
import { ChatbotUI } from './components/ChatbotUI';
// import { CoachChatPage } from './components/CoachChatPage';

export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // Handle responsive behavior
  useState(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  // Protected Route Component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem("token");
    return token  ? <>{children}</> : <Navigate to="/login" replace />;
  };

  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Onboarding Route - Requires Login */}
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <OnboardingForm />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-mint-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
                  {/* Desktop/Tablet Sidebar */}
                  {!isMobile && <Sidebar />}
                  
                  {/* Main Content */}
                  <div className={`${!isMobile ? 'ml-64 rtl:ml-0 rtl:mr-64' : 'mb-20'} transition-all duration-300`}>
                    <Routes>
                      <Route path="/dashboard" element={<MainDashboard />} />
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/meals" element={<MealsOverview />} />
                      <Route path="/meal/:mealType" element={<MealDetailsPage />} />
                      <Route path="/water" element={<WaterTrackingPage />} />
                      <Route path="/sports" element={<SportsOverview />} />
                      <Route path="/sports/goal" element={<GoalSelectionPage />} />
                      <Route path="/sports/workouts" element={<WorkoutsPage />} />
                      <Route path="/sports/gyms" element={<GymsPage />} />
                      <Route path="/sports/videos" element={<VideosPage />} />
                      <Route path="/sports/breathing" element={<BreathingPage />} />
                      <Route path="/sports/caffeine" element={<CaffeinePage />} />
                      <Route path="/sports/steps" element={<StepsCounterPage />} />
                      <Route path="/sports/timer" element={<ActivityTimerPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="//sports/activity" element={<ActivityTimerPage />} />
                      {/* <Route path="/chatBot" element={<CoachChatPage />} /> */}
                    </Routes>
                  </div>

                  {/* Mobile Bottom Navigation */}
                  {isMobile && <BottomNav />}

                  {/* Global Notification System */}
                  <GlobalNotificationSystem />

                  {/* Random Health Tips */}
                  <RandomHealthTips />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AppProvider>
  );
}