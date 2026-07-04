import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppContextType {
  darkMode: boolean;
  language: 'en' | 'ar';
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;

  fitnessGoal: string;
  setFitnessGoal: React.Dispatch<React.SetStateAction<string>>;
  toggleDarkMode: () => void;
  toggleLanguage: () => void;
  setDarkMode: (value: boolean) => void;
  setLanguage: (value: 'en' | 'ar') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkModeState] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [fitnessGoal, setFitnessGoal] = useState(
  localStorage.getItem("fitnessGoal") || ""
);
const [selectedDate, setSelectedDate] = useState(
  new Date().toISOString().split("T")[0]
);
  
  const [language, setLanguageState] = useState<'en' | 'ar'>(() => {
    return (localStorage.getItem('language') as 'en' | 'ar') || 'en';
  });

  useEffect(() => {
    // Apply dark mode class to html
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);
useEffect(() => {
  localStorage.setItem("fitnessGoal", fitnessGoal);
}, [fitnessGoal]);
  useEffect(() => {
    // Apply RTL direction for Arabic
    if (language === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
    localStorage.setItem('language', language);
  }, [language]);

  const toggleDarkMode = () => {
    setDarkModeState(prev => !prev);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => prev === 'en' ? 'ar' : 'en');
  };

  const setDarkMode = (value: boolean) => {
    setDarkModeState(value);
  };

  const setLanguage = (value: 'en' | 'ar') => {
    setLanguageState(value);
  };

  return (
    <AppContext.Provider value={{ 
      darkMode, 
      language, 
        fitnessGoal,
         selectedDate,
    setSelectedDate,
    setFitnessGoal,
      toggleDarkMode, 
      toggleLanguage,
      setDarkMode,
      setLanguage
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
