
import React, { useState } from 'react';
import { Category, Transaction, TransactionType, PaymentMethod } from '../types';
import { PAYMENT_METHODS } from '../constants';
import { X, Check, MapPin, AlignLeft, Calendar as CalIcon, CreditCard } from 'lucide-react';

interface AddTransactionProps {
  categories: Category[];
  onSave: (t: Transaction) => void;
  onCancel: () => void;
  editingTransaction: Transaction | null;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ categories, onSave, onCancel, editingTransaction }) => {
  const [type, setType] = useState<TransactionType>(editingTransaction?.type || 'EXPENSE');
  const [amount, setAmount] = useState<string>(editingTransaction?.amount.toString() || '');
  const [categoryId, setCategoryId] = useState<string>(editingTransaction?.categoryId || (categories.length > 0 ? categories[0].id : ''));
  const [date, setDate] = useState<string>(editingTransaction?.date.split('T')[0] || new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(editingTransaction?.paymentMethod || 'Cash');
  const [note, setNote] = useState<string>(editingTransaction?.note || '');
  const [location, setLocation] = useState<string>(editingTransaction?.location || '');

  const handleSave = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    
    onSave({
      id: editingTransaction?.id || Math.random().toString(36).substr(2, 9),
      amount: numAmount,
      type,
      date: new Date(date).toISOString(),
      categoryId,
      paymentMethod,
      note,
      location
    });
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b border-[#1F1F1F]">
        <button onClick={onCancel} className="p-2 bg-[#111111] rounded-full text-gray-400">
          <X size={24} />
        </button>
        <h2 className="text-lg font-bold">{editingTransaction ? 'Update Entry' : 'New Transaction'}</h2>
        <button 
          onClick={handleSave} 
          disabled={!amount || parseFloat(amount) <= 0}
          className="p-3 bg-emerald-500 text-black rounded-full disabled:opacity-30 shadow-lg shadow-emerald-500/20 active:scale-90 transition-transform"
        >
          <Check size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Type Toggle */}
        <div className="flex p-1.5 bg-[#0E1621] rounded-2xl border border-[#1F1F1F]">
          <button 
            onClick={() => setType('EXPENSE')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${type === 'EXPENSE' ? 'bg-[#1F1F1F] text-white shadow-lg' : 'text-gray-500'}`}
          >
            Expense
          </button>
          <button 
            onClick={() => setType('INCOME')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${type === 'INCOME' ? 'bg-emerald-500 text-black shadow-lg' : 'text-gray-500'}`}
          >
            Income
          </button>
        </div>

        {/* Amount Input - Pure White for Dark Mode High Contrast */}
        <div className="text-center space-y-3">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">Amount (৳ BDT)</p>
          <div className="flex items-center justify-center">
            <span className="text-4xl mr-3 text-emerald-500 font-bold">৳</span>
            <input 
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              autoFocus
              className="bg-transparent text-6xl font-bold w-full max-w-[280px] focus:outline-none text-white placeholder-gray-800 caret-emerald-500 text-center"
            />
          </div>
        </div>

        {/* Category Picker */}
        <div className="space-y-4">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest ml-1">Select Category</p>
          <div className="grid grid-cols-4 gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 ${categoryId === cat.id ? 'bg-[#111111] border-emerald-500 scale-105 z-10' : 'bg-[#0E1621] border-[#1F1F1F]'}`}
              >
                <span className="text-2xl mb-1">{cat.icon}</span>
                <span className="text-[9px] text-gray-400 font-bold truncate w-full text-center">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Details Form */}
        <div className="space-y-4 bg-[#0E1621] p-5 rounded-3xl border border-[#1F1F1F]">
          <div className="flex items-center space-x-4 border-b border-[#1F1F1F] pb-4">
            <div className="p-2 bg-black rounded-lg text-emerald-500"><CalIcon size={18} /></div>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent flex-1 text-sm focus:outline-none text-white font-medium color-scheme-dark"
            />
          </div>
          
          <div className="flex items-center space-x-4 border-b border-[#1F1F1F] pb-4">
            <div className="p-2 bg-black rounded-lg text-emerald-500"><CreditCard size={18} /></div>
            <select 
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="bg-transparent flex-1 text-sm focus:outline-none text-white font-medium"
            >
              {PAYMENT_METHODS.map(m => <option key={m} value={m} className="bg-black">{m}</option>)}
            </select>
          </div>

          <div className="flex items-center space-x-4 border-b border-[#1F1F1F] pb-4">
            <div className="p-2 bg-black rounded-lg text-emerald-500"><AlignLeft size={18} /></div>
            <input 
              type="text" 
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-transparent flex-1 text-sm focus:outline-none text-white placeholder-gray-600 font-medium"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-2 bg-black rounded-lg text-emerald-500"><MapPin size={18} /></div>
            <input 
              type="text" 
              placeholder="Location (Optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent flex-1 text-sm focus:outline-none text-white placeholder-gray-600 font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
