
import React, { useState, useMemo } from 'react';
import { AppState, Category } from '../types';
import Card from '../components/Card';
import { Plus, X, Lock, Unlock, Check, Trash2, Hash, Search, LayoutGrid } from 'lucide-react';

interface CategoriesProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
}

const PRESET_COLORS = [
  '#10B981', '#3B82F6', '#EF4444', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
  '#6366F1', '#14B8A6', '#84CC16', '#A855F7'
];

const SUGGESTED_EMOJIS = [
  '🍔', '🚗', '🛍️', '📄', '💰', '🎬', '🏥', '🏠', 
  '💡', '🎁', '📱', '🏋️', '🎓', '✈️', '🎮', '🛠️'
];

const Categories: React.FC<CategoriesProps> = ({ state, onUpdateState }) => {
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT' | null>(null);
  const [currentCat, setCurrentCat] = useState<Partial<Category>>({
    name: '',
    icon: '📦',
    color: '#10B981',
    isPrivate: false,
    budget: 0
  });

  const openAdd = () => {
    setCurrentCat({ name: '', icon: '📦', color: '#10B981', isPrivate: false, budget: 0 });
    setModalMode('ADD');
  };

  const openEdit = (cat: Category) => {
    setCurrentCat(cat);
    setModalMode('EDIT');
  };

  const handleSave = () => {
    if (!currentCat.name) return;

    if (modalMode === 'ADD') {
      const cat: Category = {
        id: Math.random().toString(36).substr(2, 9),
        name: currentCat.name!,
        icon: currentCat.icon || '📦',
        color: currentCat.color || '#10B981',
        isPrivate: !!currentCat.isPrivate,
        budget: currentCat.budget || 0
      };
      onUpdateState(prev => ({ ...prev, categories: [...prev.categories, cat] }));
    } else if (modalMode === 'EDIT') {
      onUpdateState(prev => ({
        ...prev,
        categories: prev.categories.map(c => c.id === currentCat.id ? (currentCat as Category) : c)
      }));
    }
    setModalMode(null);
  };

  const removeCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category? All related transactions will remain but without category info.')) {
      onUpdateState(prev => ({ ...prev, categories: prev.categories.filter(c => c.id !== id) }));
      setModalMode(null);
    }
  };

  const handleHexChange = (val: string) => {
    let cleanHex = val;
    if (!val.startsWith('#')) cleanHex = '#' + val;
    if (cleanHex.length > 7) cleanHex = cleanHex.slice(0, 7);
    setCurrentCat({ ...currentCat, color: cleanHex });
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center mt-2">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Custom Labels & Budgets</p>
        </div>
        <button 
          onClick={openAdd}
          className="p-3 bg-emerald-500 text-black rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-90 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {state.categories.map(cat => (
          <Card 
            key={cat.id} 
            onClick={() => openEdit(cat)}
            className="relative group bg-[#0A0A0A] border-[#1F1F1F] p-5 flex flex-col items-center space-y-3 hover:border-emerald-500/50"
          >
            <div 
              className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-inner relative transition-transform group-active:scale-95"
              style={{ backgroundColor: `${cat.color}10`, border: `1.5px solid ${cat.color}30` }}
            >
              {cat.icon}
              {cat.isPrivate && (
                <div className="absolute -top-1 -right-1 bg-black p-1.5 rounded-full border border-emerald-500 shadow-lg shadow-emerald-500/20">
                  <Lock size={12} className="text-emerald-500" />
                </div>
              )}
            </div>
            <div className="text-center w-full">
              <p className="text-sm font-bold text-white truncate px-2">{cat.name}</p>
              <p className="mt-1 text-[9px] text-gray-500 font-bold uppercase tracking-tight">
                {cat.budget ? `৳${cat.budget.toLocaleString()}` : 'No Limit'}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-black z-[110] flex flex-col animate-in slide-in-from-bottom duration-300">
           <div className="flex justify-between items-center p-6 border-b border-[#1F1F1F]">
             <button onClick={() => setModalMode(null)} className="p-2 bg-[#111111] rounded-full text-gray-400"><X size={20} /></button>
             <h2 className="text-lg font-bold">{modalMode === 'ADD' ? 'Create Category' : 'Edit Category'}</h2>
             <button onClick={handleSave} className="p-2 bg-emerald-500 text-black rounded-full shadow-lg shadow-emerald-500/20"><Check size={20} /></button>
           </div>

           <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-10">
              {/* Preview Card */}
              <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-[#0E1621] border border-[#1F1F1F] flex flex-col items-center justify-center space-y-2 shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10" style={{ backgroundColor: currentCat.color }} />
                      <span className="text-5xl z-10">{currentCat.icon}</span>
                      <p className="text-xs font-bold text-gray-400 z-10 truncate max-w-[80%]">{currentCat.name || 'Untitled'}</p>
                  </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest ml-1">Category Name</label>
                    <input 
                    type="text" 
                    value={currentCat.name}
                    onChange={e => setCurrentCat({ ...currentCat, name: e.target.value })}
                    placeholder="e.g. Shopping"
                    className="w-full bg-[#0E1621] border border-[#1F1F1F] rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest ml-1">Monthly Budget (৳)</label>
                    <input 
                    type="number" 
                    value={currentCat.budget || ''}
                    onChange={e => setCurrentCat({ ...currentCat, budget: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter limit..."
                    className="w-full bg-[#0E1621] border border-[#1F1F1F] rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                </div>
              </div>

              {/* Icon Picker */}
              <div className="space-y-3">
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest ml-1">Select Icon</label>
                  <div className="grid grid-cols-6 gap-3">
                      {SUGGESTED_EMOJIS.map(emoji => (
                          <button 
                            key={emoji}
                            onClick={() => setCurrentCat({ ...currentCat, icon: emoji })}
                            className={`aspect-square flex items-center justify-center text-2xl rounded-xl border transition-all ${currentCat.icon === emoji ? 'bg-emerald-500/20 border-emerald-500' : 'bg-[#0E1621] border-[#1F1F1F] active:scale-90'}`}
                          >
                              {emoji}
                          </button>
                      ))}
                      <div className="col-span-6">
                           <input 
                            type="text"
                            placeholder="Type custom emoji..."
                            value={currentCat.icon}
                            onChange={e => setCurrentCat({ ...currentCat, icon: e.target.value })}
                            className="w-full bg-[#0E1621] border border-[#1F1F1F] rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500"
                           />
                      </div>
                  </div>
              </div>

              {/* Color Picker */}
              <div className="space-y-3">
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest ml-1">Theme Color</label>
                  <div className="grid grid-cols-6 gap-3">
                      {PRESET_COLORS.map(color => (
                          <button 
                            key={color}
                            onClick={() => setCurrentCat({ ...currentCat, color })}
                            className={`aspect-square rounded-xl border-2 transition-all ${currentCat.color === color ? 'border-white scale-110 shadow-lg' : 'border-transparent active:scale-90'}`}
                            style={{ backgroundColor: color }}
                          />
                      ))}
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <div className="relative flex-none">
                      <input 
                        type="color" 
                        value={currentCat.color}
                        onChange={e => setCurrentCat({ ...currentCat, color: e.target.value })}
                        className="w-14 h-14 bg-transparent border-0 rounded-2xl cursor-pointer p-0 overflow-hidden appearance-none"
                      />
                      <div className="absolute inset-0 rounded-2xl pointer-events-none border border-[#1F1F1F]" style={{ backgroundColor: currentCat.color }} />
                    </div>
                    <div className="relative flex-1">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                      <input 
                        type="text"
                        value={currentCat.color?.replace('#', '')}
                        onChange={e => handleHexChange(e.target.value)}
                        placeholder="FFFFFF"
                        className="w-full bg-[#0E1621] border border-[#1F1F1F] rounded-2xl p-4 pl-9 text-xs font-mono uppercase tracking-widest text-white focus:outline-none focus:border-emerald-500 h-14"
                      />
                    </div>
                  </div>
              </div>

              {/* Settings Toggle */}
              <div className="space-y-4">
                  <button 
                    onClick={() => setCurrentCat({...currentCat, isPrivate: !currentCat.isPrivate})}
                    className={`w-full flex items-center justify-between p-5 rounded-3xl border transition-all ${currentCat.isPrivate ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-[#0E1621] border-[#1F1F1F] text-gray-500'}`}
                  >
                    <div className="flex flex-col items-start text-left">
                        <span className="text-sm font-bold">Private Category</span>
                        <span className="text-[10px] opacity-70">Hide from history unless PIN is entered</span>
                    </div>
                    {currentCat.isPrivate ? <Lock size={20} /> : <Unlock size={20} />}
                  </button>

                  {modalMode === 'EDIT' && (
                    <button 
                        onClick={() => removeCategory(currentCat.id!)}
                        className="w-full flex items-center justify-center p-5 bg-red-500/10 text-red-500 rounded-3xl border border-red-500/20 active:scale-[0.98] transition-all space-x-2"
                    >
                        <Trash2 size={18} />
                        <span className="text-sm font-bold">Delete Category</span>
                    </button>
                  )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
