import { Link, useLocation } from 'react-router-dom';
import { Home, Utensils, Droplets, Dumbbell } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t } from '../utils/translations';

export function BottomNav() {
  const location = useLocation();
  const { language } = useApp();

  const navItems = [
    { path: '/dashboard', icon: Home, label: t('dashboard', language) },
    { path: '/meals', icon: Utensils, label: t('meals', language) },
    { path: '/water', icon: Droplets, label: t('water', language) },
    { path: '/sports', icon: Dumbbell, label: t('sports', language) },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-sky-100 dark:border-gray-800 shadow-lg z-50 transition-colors duration-300">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                isActive
                  ? 'text-sky-600 dark:text-sky-400'
                  : 'text-sky-400 dark:text-gray-500'
              }`}
            >
              <div className={`p-2 rounded-xl ${isActive ? 'bg-gradient-to-r from-sky-100 to-mint-100 dark:from-sky-900/40 dark:to-mint-900/40' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] md:text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}