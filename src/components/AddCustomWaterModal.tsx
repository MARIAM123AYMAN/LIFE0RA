import { X } from 'lucide-react';
import { useState } from 'react';

interface AddCustomWaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWater: (amount: number) => void;
}

export function AddCustomWaterModal({ isOpen, onClose, onAddWater }: AddCustomWaterModalProps) {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const waterAmount = Number(amount);
    if (waterAmount > 0) {
      onAddWater(waterAmount);
      setAmount('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="border-b border-sky-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sky-900">Add Custom Water Amount</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-sky-600 hover:bg-sky-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm text-sky-700 mb-2">Amount (ml)</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 350"
              min="1"
              className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
            />
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
              Add Water
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
