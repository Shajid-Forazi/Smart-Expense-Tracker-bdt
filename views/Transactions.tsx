
import React, { useState, useMemo } from 'react';
import { AppState, Transaction } from '../types';
import { Search, Filter, ArrowUpDown, Trash2, Edit2, ChevronLeft } from 'lucide-react';

interface TransactionsProps {
  state: AppState;
  onDelete: (id: string) => void;
  onEdit: (t: Transaction) => void;
}

const Transactions: React.FC<TransactionsProps> = ({ state, onDelete, onEdit }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'EXPENSE' | 'INCOME'>('ALL');

  const filteredTransactions = useMemo(() => {
    return state.transactions.filter(t => {
      const matchesSearch = t.note.toLowerCase().includes(search.toLowerCase()) || 
                            state.categories.find(c => c.id === t.categoryId)?.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'ALL' || t.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [state, search, filter]);

  const getCategory = (id: string) => state.categories.find(c => c.id === id);

  return (
    <div className="p-4 flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center mt-2">
        <h1 className="text-2xl font-bold">History</h1>
        <div className="flex space-x-2">
           <button className="p-2 bg-[#111111] rounded-xl border border-[#1F1F1F]">
              <ArrowUpDown size={18} className="text-[#B0B0B0]" />
           </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555555]" size={18} />
        <input 
          type="text"
          placeholder="Search by note or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111111] border border-[#1F1F1F] rounded-2xl py-3 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none placeholder-[#555555]"
        />
      </div>

      <div className="flex space-x-2">
        {['ALL', 'EXPENSE', 'INCOME'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${filter === f ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-transparent border-[#1F1F1F] text-[#B0B0B0]'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-3 pb-8">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-20 text-[#555555]">
            <p className="text-sm">No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map(t => {
            const cat = getCategory(t.categoryId);
            return (
              <div 
                key={t.id} 
                className="group relative flex flex-col p-4 bg-[#111111] border border-[#1F1F1F] rounded-2xl active:scale-[0.99] transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-sm">
                      {cat?.icon || '📦'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{cat?.name}</h4>
                      <p className="text-[10px] text-[#B0B0B0]">{new Date(t.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${t.type === 'INCOME' ? 'text-emerald-500' : 'text-white'}`}>
                      {t.type === 'INCOME' ? '+' : '-'} ৳{t.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[#B0B0B0]">{t.paymentMethod}</p>
                  </div>
                </div>
                {t.note && <p className="text-xs text-[#B0B0B0] mt-1 border-t border-[#1F1F1F] pt-2 italic">"{t.note}"</p>}
                
                <div className="flex justify-end space-x-3 mt-3">
                  <button onClick={() => onEdit(t)} className="p-2 text-gray-500 hover:text-emerald-500">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => onDelete(t.id)} className="p-2 text-gray-500 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Transactions;
