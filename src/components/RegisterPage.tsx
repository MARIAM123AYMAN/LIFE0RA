import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Droplets } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { t } from '../utils/translations';
import logo from "../assets/pro_grad.png";
import Confetti from "react-confetti";
const BASE_URL = "http://balancelifeapp.runasp.net/api/Authentication";
export function RegisterPage() {
  const navigate = useNavigate();
  const { language } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError(language === 'en' ? 'Please fill in all fields' : 'يرجى ملء جميع الحقول');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(language === 'en' ? 'Passwords do not match' : 'كلمات المرور غير متطابقة');
      return;
    }

// Password length
if (formData.password.length < 6) {
  setError(
    language === "en"
      ? "Password must be at least 6 characters"
      : "يجب أن تكون كلمة المرور 6 أحرف على الأقل"
  );
  return;
}

// Password validation
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/;

if (!passwordRegex.test(formData.password)) {
  setError(
    language === "en"
      ? "Password must contain uppercase, lowercase and special character."
      : "يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير ورمز."
  );
  return;
}

    setIsLoading(true);

try {
  // Check email exists
  const checkResponse = await fetch(
    `${BASE_URL}/emailExists?email=${encodeURIComponent(formData.email)}`
  );

  const emailExists = await checkResponse.json();

  if (emailExists) {
    setError(
      language === "en"
        ? "Email already registered"
        : "البريد الإلكتروني مستخدم بالفعل"
    );
    setIsLoading(false);
    return;
  }

  // Register
  const response = await fetch(`${BASE_URL}/Register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: formData.email,
      displayName: formData.name,
      userName: formData.name,
      password: formData.password,
    }),
  });

  const data = await response.json();
if (!response.ok) {
  const message =
    data.errors
      ? Object.values(data.errors).flat().join("\n")
      : data.title || "Register Failed";

  throw new Error(message);
}

  localStorage.setItem("token", data.token);
  localStorage.setItem("userEmail", data.email);
  localStorage.setItem("userName", data.displayName);
  localStorage.setItem("isLoggedIn", "true");

  navigate("/onboarding");
}catch (err: any) {
  setError(err.message);
} finally {
  setIsLoading(false);
}
  };

  const handleSocialSignup = (provider: string) => {
    // Simulate social signup
    const newUser = {
      name: `${provider} User`,
      email: `${provider.toLowerCase()}@example.com`,
      password: 'social-login',
      registeredAt: new Date().toISOString(),
    };
    
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    existingUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    
    localStorage.setItem('userName', newUser.name);
    localStorage.setItem('userEmail', newUser.email);
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/dashboard');
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-mint-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
             <div className=" w-50 h-50">
                          <img src={logo} alt="LifeOra" className='w-full h-full' />
                        </div>
            </div>
          <p className="text-sky-600 dark:text-gray-400">
            {language === 'en' ? 'Create your account and start your wellness journey' : 'أنشئ حسابك وابدأ رحلتك الصحية'}
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm">
          <h2 className="text-sky-900 dark:text-white mb-6 text-center">{t('signUp', language)}</h2>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-2xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm text-sky-700 dark:text-gray-300 mb-2">{t('fullName', language)}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('enterName', language)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-sky-50 dark:bg-gray-700 border border-sky-100 dark:border-gray-600 text-sky-900 dark:text-white placeholder:text-sky-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-600"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-sky-700 dark:text-gray-300 mb-2">{t('emailAddress', language)}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400 dark:text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('enterEmail', language)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-sky-50 dark:bg-gray-700 border border-sky-100 dark:border-gray-600 text-sky-900 dark:text-white placeholder:text-sky-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-600"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-sky-700 dark:text-gray-300 mb-2">{t('password', language)}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400 dark:text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={language === 'en' ? 'At least 6 characters' : '6 أحرف على الأقل'}
                  className="w-full pl-12 pr-12 py-3 rounded-2xl bg-sky-50 dark:bg-gray-700 border border-sky-100 dark:border-gray-600 text-sky-900 dark:text-white placeholder:text-sky-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-400 dark:text-gray-500 hover:text-sky-600 dark:hover:text-gray-400 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-sky-700 dark:text-gray-300 mb-2">{t('confirmPassword', language)}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400 dark:text-gray-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder={language === 'en' ? 'Re-enter your password' : 'أعد إدخال كلمة المرور'}
                  className="w-full pl-12 pr-12 py-3 rounded-2xl bg-sky-50 dark:bg-gray-700 border border-sky-100 dark:border-gray-600 text-sky-900 dark:text-white placeholder:text-sky-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-400 dark:text-gray-500 hover:text-sky-600 dark:hover:text-gray-400 transition-colors"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="text-xs text-sky-600 dark:text-gray-400">
              {language === 'en' ? 'By signing up, you agree to our ' : 'بالتسجيل، أنت توافق على '}
              {/* <button type="button" className="text-sky-900 dark:text-sky-400 hover:underline">
                {language === 'en' ? 'Terms of Service' : 'شروط الخدمة'}
              </button>{' '} */}
              {language === 'en' ? 'and ' : 'و '}
              <Link to="/privacy" className="text-sky-900 dark:text-sky-400 text-xl hover:underline">
                {language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-sky-900 dark:bg-sky-700 text-white hover:bg-sky-800 dark:hover:bg-sky-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (language === 'en' ? 'Creating account...' : 'جاري إنشاء الحساب...') : t('signUp', language)}
            </button>
          </form>

          {/* Divider */}
          {/* <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sky-100 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-sky-600 dark:text-gray-400">
                {language === 'en' ? 'Or sign up with' : 'أو سجل باستخدام'}
              </span>
            </div>
          </div> */}

          {/* Social Signup */}
          {/* <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialSignup('Google')}
              className="px-4 py-3 rounded-2xl bg-sky-50 dark:bg-gray-700 hover:bg-sky-100 dark:hover:bg-gray-600 text-sky-900 dark:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
              title="Sign up with Google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              onClick={() => handleSocialSignup('Apple')}
              className="px-4 py-3 rounded-2xl bg-sky-50 dark:bg-gray-700 hover:bg-sky-100 dark:hover:bg-gray-600 text-sky-900 dark:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
              title="Sign up with Apple"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <span>Apple</span>
            </button>
          </div> */}

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-sky-600 dark:text-gray-400">
            {t('alreadyHaveAccount', language)}{' '}
            <Link to="/login" className="text-sky-900 dark:text-sky-400 hover:underline font-medium">
              {t('login', language)}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}