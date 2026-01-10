
import React, { useMemo, useState } from 'react';
import { AppState, Transaction } from '../types';
import Card from '../components/Card';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, TrendingUp, TrendingDown, ReceiptText } from 'lucide-react';

interface CalendarViewProps {
  state: AppState;
}

const CalendarView: React.FC<CalendarViewProps> = ({ state }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Helper to format date consistently for comparison (Local YYYY-MM-DD)
  const toLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentMonth]);

  const getDayData = (date: Date) => {
    const dateStr = toLocalDateString(date);
    const dayTransactions = state.transactions.filter(t => toLocalDateString(new Date(t.date)) === dateStr);
    const expense = dayTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    const income = dayTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    return { expense, income, txs: dayTransactions };
  };

  const changeMonth = (offset: number) => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + offset);
    setCurrentMonth(next);
  };

  const dayDetails = useMemo(() => getDayData(selectedDate), [selectedDate, state.transactions]);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mt-2">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex items-center bg-[#111111] rounded-xl border border-[#1F1F1F] p-1">
          <button onClick={() => changeMonth(-1)} className="p-1.5 text-gray-400 active:text-white"><ChevronLeft size={20} /></button>
          <span className="px-4 text-[11px] font-bold uppercase tracking-widest min-w-[100px] text-center">
            {currentMonth.toLocaleString('default', { month: 'short', year: 'numeric' })}
          </span>
          <button onClick={() => changeMonth(1)} className="p-1.5 text-gray-400 active:text-white"><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="p-3">
        <div className="grid grid-cols-7 gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-gray-600 py-2">{d}</div>
          ))}
          {Array(daysInMonth[0].getDay()).fill(null).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {daysInMonth.map(day => {
            const { expense, income } = getDayData(day);
            const isSelected = toLocalDateString(day) === toLocalDateString(selectedDate);
            const isToday = toLocalDateString(day) === toLocalDateString(new Date());
            
            const intensity = expense > 5000 ? 'bg-emerald-500' : 
                              expense > 2000 ? 'bg-emerald-500/60' : 
                              expense > 0 ? 'bg-emerald-500/10' : 'bg-transparent';

            return (
              <button 
                key={day.toISOString()} 
                onClick={() => setSelectedDate(day)}
                className={`relative aspect-square rounded-xl flex flex-col items-center justify-center border transition-all duration-200 
                  ${isSelected ? 'border-emerald-500 bg-emerald-500/20 z-10 scale-105' : 'border-[#1F1F1F]'} 
                  ${!isSelected ? intensity : ''}`}
              >
                <span className={`text-[11px] font-bold ${isSelected ? 'text-emerald-500' : (expense > 2000 ? 'text-black' : 'text-white')}`}>
                  {day.getDate()}
                </span>
                
                <div className="flex space-x-0.5 mt-0.5">
                    {income > 0 && <div className="w-1 h-1 rounded-full bg-emerald-400" />}
                    {expense > 0 && <div className="w-1 h-1 rounded-full bg-red-400" />}
                </div>

                {isToday && !isSelected && (
                    <div className="absolute top-1 right-1 w-1 h-1 bg-cyan-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Selected Day Details */}
      <div className="space-y-4 pb-4">
          <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CalIcon size={18} className="text-emerald-500" />
                <h3 className="text-sm font-bold text-gray-200">
                  {selectedDate.toLocaleDateString(undefined, { day: 'numeric', month: 'long', weekday: 'short' })}
                </h3>
              </div>
              {dayDetails.txs.length > 0 && (
                <span className="text-[10px] bg-[#111111] px-2 py-1 rounded-md text-gray-400 border border-[#1F1F1F]">
                  {dayDetails.txs.length} Entries
                </span>
              )}
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0E1621] border border-[#1F1F1F] p-4 rounded-2xl flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                      <TrendingUp size={16} />
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Income</p>
                      <p className="text-sm font-bold">৳{dayDetails.income.toLocaleString()}</p>
                  </div>
              </div>
              <div className="bg-[#0E1621] border border-[#1F1F1F] p-4 rounded-2xl flex items-center space-x-3">
                  <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                      <TrendingDown size={16} />
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Expense</p>
                      <p className="text-sm font-bold">৳{dayDetails.expense.toLocaleString()}</p>
                  </div>
              </div>
          </div>

          <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1 flex items-center">
                <ReceiptText size={12} className="mr-1" /> Transactions
              </h4>
              {dayDetails.txs.length === 0 ? (
                  <div className="text-center py-10 bg-[#0A0A0A] border border-dashed border-[#1F1F1F] rounded-2xl text-gray-700 italic text-xs">
                    No transactions recorded for this day
                  </div>
              ) : (
                  <div className="space-y-3">
                      {dayDetails.txs.map(t => {
                          const cat = state.categories.find(c => c.id === t.categoryId);
                          return (
                              <div key={t.id} className="flex items-center justify-between p-4 bg-[#0E1621] border border-[#1F1F1F] rounded-2xl active:scale-95 transition-transform">
                                  <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-lg shadow-inner" style={{ border: `1px solid ${cat?.color}40` }}>
                                          {cat?.icon || '📦'}
                                      </div>
                                      <div>
                                          <p className="text-sm font-bold text-white">{cat?.name || 'General'}</p>
                                          <p className="text-[10px] text-gray-500">{t.paymentMethod} • {new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                      </div>
                                  </div>
                                  <div className="text-right">
                                      <p className={`text-sm font-bold ${t.type === 'INCOME' ? 'text-emerald-500' : 'text-white'}`}>
                                          {t.type === 'INCOME' ? '+' : '-'} ৳{t.amount.toLocaleString()}
                                      </p>
                                      {t.note && <p className="text-[9px] text-gray-500 truncate max-w-[100px] italic">"{t.note}"</p>}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default CalendarView;
