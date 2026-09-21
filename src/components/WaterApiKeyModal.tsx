import { X, Key, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface WaterApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  currentApiKey: string;
}

export function WaterApiKeyModal({
  isOpen,
  onClose,
  onSave,
  currentApiKey,
}: WaterApiKeyModalProps) {
  const [apiKey, setApiKey] = useState(currentApiKey);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
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
          <div className="bg-sky-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-sky-700 mb-2">
              Get personalized hydration insights powered by Google Gemini AI.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              Get your free API key
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
                className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
              />
              <p className="text-xs text-sky-600 mt-2">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl border border-sky-200 text-sky-700 hover:bg-sky-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-sm"
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
