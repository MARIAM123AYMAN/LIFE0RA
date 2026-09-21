import { X, Key, ExternalLink, Camera } from 'lucide-react';
import { useState } from 'react';

interface MealApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MealApiKeyModal({ isOpen, onClose }: MealApiKeyModalProps) {
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('geminiApiKey') || '';
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('geminiApiKey', apiKey.trim());
      alert('API Key saved successfully!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="border-b border-sky-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-sky-600" />
              <h2 className="text-sky-900">Gemini API Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-sky-600 hover:bg-sky-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-sky-50 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3 mb-3">
              <Camera className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-sky-900 mb-2">
                  Enable AI-powered food recognition and nutrition analysis from photos!
                </p>
                <p className="text-sm text-sky-700">
                  Get instant nutritional breakdown, health scores, and personalized recommendations.
                </p>
              </div>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              Get your free Gemini API key
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm text-sky-700 mb-2">
                Gemini API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="w-full px-4 py-3 rounded-2xl border border-sky-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
              />
              <p className="text-xs text-sky-600 mt-2">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>

            <div className="bg-mint-50 rounded-2xl p-4 mb-6">
              <h3 className="text-sm text-mint-900 mb-2">What you'll get:</h3>
              <ul className="space-y-1 text-sm text-mint-700">
                <li>✓ Food recognition from photos</li>
                <li>✓ Automatic nutrition calculation</li>
                <li>✓ Health score analysis</li>
                <li>✓ Ingredient identification</li>
                <li>✓ Personalized recommendations</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-2xl border border-sky-200 text-sky-700 hover:bg-sky-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-mint-500 text-white hover:from-sky-600 hover:to-mint-600 transition-all shadow-sm"
              >
                Save Key
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
