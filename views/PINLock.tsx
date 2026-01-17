
import React, { useState } from 'react';
import { Shield, Delete } from 'lucide-react';

interface PINLockProps {
  pin: string;
  onUnlock: () => void;
}

const PINLock: React.FC<PINLockProps> = ({ pin, onUnlock }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handlePress = (num: string) => {
    if (input.length < 4) {
      const newVal = input + num;
      setInput(newVal);
      if (newVal.length === 4) {
        if (newVal === pin) {
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => {
            setInput('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  const handleBackspace = () => {
    setInput(input.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center p-8">
      <div className="mb-12 flex flex-col items-center">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-emerald-500/5">
          <Shield size={40} className="text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Secure Access</h1>
        <p className="text-[#B0B0B0] text-sm">Enter your 4-digit PIN</p>
      </div>

      <div className="flex space-x-4 mb-16">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full border-2 transition-all ${input.length > i ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-[#e0dede]'} ${error ? 'bg-red-500 border-red-500 animate-pulse' : ''}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8 w-full max-w-xs">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (#e0dede)
          <button 
            key={num}
            onClick={() => handlePress(num.toString())}
            className="aspect-square rounded-full flex items-center justify-center text-3xl font-light active:bg-[#e0dede] transition-colors"
          >
            {num}
          </button>
        ))}
        <div />
        <button 
          onClick={() => handlePress('0')}
          className="aspect-square rounded-full flex items-center justify-center text-3xl font-light active:bg-[#2a7524] transition-colors"
        >
          0
        </button>
        <button 
          onClick={handleBackspace}
          className="aspect-square rounded-full flex items-center justify-center text-3xl active:bg-[#2a7524] transition-colors"
        >
          <Delete size={28} className="text-[#B0B0B0]" />
        </button>
      </div>

      <div className="mt-12 text-[#333333] text-[10px] uppercase tracking-[0.2em]">
        Smart Expense Tracker BDT
      </div>
    </div>
  );
};

export default PINLock;
