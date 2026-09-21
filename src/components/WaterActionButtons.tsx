import { Plus } from 'lucide-react';
import { useState } from 'react';
import { AddCustomWaterModal } from './AddCustomWaterModal';

interface WaterActionButtonsProps {
  onAddWater: (amount: number) => void;
    cups:number;
}

export function WaterActionButtons({ onAddWater , cups }: WaterActionButtonsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const quickAmounts = [
    { amount: 100, label: '+100ml' },
    { amount: 250, label: '+250ml' },
    { amount: 500, label: '+500ml' },
  ];

const handleCustomAdd = (amount: number) => {
  console.log("CUSTOM:", amount);

  onAddWater(amount);

  setIsModalOpen(false);
};

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-md">
        
<div className="flex justify-center gap-6 mb-4">
  {quickAmounts.map((item) => (
    <button
      key={item.amount}
      onClick={() => onAddWater(item.amount)}
      className="flex flex-col items-center"
    >
      <div className="relative w-14 h-20 border-2 border-sky-400 rounded-b-xl overflow-hidden bg-white">
        <div
          className="absolute bottom-0 left-0 w-full bg-sky-500"
          style={{
            height:
              item.amount === 100
                ? "30%"
                : item.amount === 250
                ? "60%"
                : "90%",
          }}
        />
      </div>

      <span className="mt-2 text-sky-700 text-sm">
        {item.amount}ml
      </span>
    </button>
  ))}
</div>
          
         <button
  onClick={() => setIsModalOpen(true)}
  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-colors"
>
  <Plus className="w-4 h-4" />
  <span>Custom Amount</span>
</button>
        </div>
      

      <AddCustomWaterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddWater={handleCustomAdd}
      />
    </>
  );
}