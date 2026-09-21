import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Utensils, Droplets, Dumbbell, LogOut } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t } from '../utils/translations';
import pro_grad from '../assets/pro_grad.png'
export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useApp();
  const userName = localStorage.getItem('userName') || 'User';

  const navItems = [
    { path: '/dashboard', icon: Home, label: t('dashboard', language) },
    { path: '/meals', icon: Utensils, label: t('meals', language) },
    { path: '/water', icon: Droplets, label: t('water', language) },
    { path: '/sports', icon: Dumbbell, label: t('sports', language) },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className="fixed left-0 rtl:left-auto rtl:right-0 top-0 h-screen w-64 bg-card shadow-sm border-r rtl:border-r-0 rtl:border-l border-sky-100 dark:border-gray-800 p-6 z-30 flex flex-col transition-colors duration-300">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center ">
            {/* <span className="text-2xl">🌿</span> */}
            <img src={pro_grad} alt="" />
          </div>
          <div>
            <h1 className="text-sky-900 dark:text-sky-100">Balance Life</h1>
            <p className="text-xs text-sky-600 dark:text-sky-400">{language === 'en' ? 'Health Wellness' : 'الصحة والرفاهية'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500 to-mint-500 text-white shadow-md'
                  : 'text-sky-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-sky-100 dark:border-gray-800 pt-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-50 to-mint-50 dark:from-gray-800 dark:to-gray-800 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-mint-400 flex items-center justify-center text-white shadow-md">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-sm text-sky-900 dark:text-white font-medium">{userName}</p>
            <p className="text-xs text-sky-600 dark:text-gray-400">Premium</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          title={t('logout', language)}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{t('logout', language)}</span>
        </button>
      </div>
    </div>
  );
}