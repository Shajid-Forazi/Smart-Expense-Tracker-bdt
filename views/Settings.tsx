
import React, { useState } from 'react';
import { AppState, ViewType } from '../types';
import Card from '../components/Card';
import { Shield, Trash2, Globe, Database, ChevronRight, AlertTriangle, Layers, Target, Clock } from 'lucide-react';

interface SettingsProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  onReset: (type: 'ALL' | 'EXPENSES' | 'INCOME' | 'CATEGORIES' | 'BALANCE') => void;
  onViewChange?: (view: ViewType) => void;
}

const Settings: React.FC<SettingsProps> = ({ state, onUpdateState, onReset, onViewChange }) => {
  const [showResetModal, setShowResetModal] = useState(false);

  const togglePin = () => {
    if (state.pin) {
      onUpdateState(prev => ({ ...prev, pin: null }));
    } else {
      const newPin = prompt("Enter new 4-digit PIN:");
      if (newPin && newPin.length === 4) {
        onUpdateState(prev => ({ ...prev, pin: newPin }));
      }
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "smart_expense_bdt_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const updateBudget = (field: 'totalMonthly' | 'dailyLimit', val: string) => {
    const num = parseFloat(val) || 0;
    onUpdateState(prev => ({
      ...prev,
      budget: { ...prev.budget, [field]: num }
    }));
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold mt-2">Settings</h1>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest px-1">Budget Limits</h3>
        <Card className="p-4 space-y-5 bg-[#0E1621]">
            <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[#B0B0B0]">
                    <Target size={16} />
                    <label className="text-xs font-bold uppercase tracking-wider">Monthly Budget (৳)</label>
                </div>
                <input 
                    type="number"
                    value={state.budget.totalMonthly || ''}
                    onChange={(e) => updateBudget('totalMonthly', e.target.value)}
                    placeholder="Set monthly goal..."
                    className="w-full bg-black border border-[#1F1F1F] rounded-xl p-3 text-white font-bold focus:border-emerald-500 focus:outline-none"
                />
            </div>
            <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[#B0B0B0]">
                    <Clock size={16} />
                    <label className="text-xs font-bold uppercase tracking-wider">Daily Spending Limit (৳)</label>
                </div>
                <input 
                    type="number"
                    value={state.budget.dailyLimit || ''}
                    onChange={(e) => updateBudget('dailyLimit', e.target.value)}
                    placeholder="Set daily limit..."
                    className="w-full bg-black border border-[#1F1F1F] rounded-xl p-3 text-white font-bold focus:border-emerald-500 focus:outline-none"
                />
            </div>
        </Card>

        <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest px-1">Preference</h3>
        <Card className="p-0 overflow-hidden divide-y divide-[#1F1F1F]">
          <div className="flex items-center justify-between p-4 cursor-pointer" onClick={togglePin}>
            <div className="flex items-center space-x-3">
              <Shield size={20} className="text-[#B0B0B0]" />
              <div>
                <p className="text-sm font-medium">PIN Security</p>
                <p className="text-[10px] text-[#B0B0B0]">{state.pin ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
            <div className={`w-10 h-5 rounded-full transition-colors ${state.pin ? 'bg-emerald-500' : 'bg-[#1A1A1A]'} relative`}>
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${state.pin ? 'left-6' : 'left-1'}`} />
            </div>
          </div>

          <div 
            className="flex items-center justify-between p-4 cursor-pointer active:bg-white/5" 
            onClick={() => onViewChange?.('CATEGORIES')}
          >
            <div className="flex items-center space-x-3">
              <Layers size={20} className="text-[#B0B0B0]" />
              <div>
                <p className="text-sm font-medium">Manage Categories</p>
                <p className="text-[10px] text-[#B0B0B0]">Edit icons, colors & budgets</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#333333]" />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Globe size={20} className="text-[#B0B0B0]" />
              <div>
                <p className="text-sm font-medium">Language</p>
                <p className="text-[10px] text-[#B0B0B0]">{state.language === 'EN' ? 'English' : 'Bangla'}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#333333]" />
          </div>
        </Card>

        <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest px-1">Danger Zone</h3>
        <Card className="p-0 overflow-hidden divide-y divide-[#1F1F1F]">
          <button onClick={handleExport} className="w-full flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Database size={20} className="text-[#B0B0B0]" />
              <p className="text-sm font-medium">Export Data (Backup)</p>
            </div>
            <ChevronRight size={18} className="text-[#333333]" />
          </button>

          <button onClick={() => setShowResetModal(true)} className="w-full flex items-center justify-between p-4 text-red-500">
            <div className="flex items-center space-x-3">
              <Trash2 size={20} />
              <p className="text-sm font-medium">Reset Management</p>
            </div>
            <ChevronRight size={18} className="text-[#333333]" />
          </button>
        </Card>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-end justify-center">
          <div className="w-full max-w-lg bg-[#0A0A0A] border-t border-[#1F1F1F] rounded-t-3xl p-6 pb-12 space-y-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center space-x-3 text-red-500">
              <AlertTriangle size={24} />
              <h2 className="text-xl font-bold">Reset Options</h2>
            </div>
            <p className="text-[#B0B0B0] text-sm">Select the data scope you want to wipe. This action cannot be undone.</p>
            
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => { onReset('EXPENSES'); setShowResetModal(false); }} className="p-4 bg-[#111111] border border-[#1F1F1F] rounded-2xl text-left font-medium active:bg-[#1A1A1A]">Reset Only Expenses</button>
              <button onClick={() => { onReset('INCOME'); setShowResetModal(false); }} className="p-4 bg-[#111111] border border-[#1F1F1F] rounded-2xl text-left font-medium active:bg-[#1A1A1A]">Reset Only Income</button>
              <button onClick={() => { onReset('BALANCE'); setShowResetModal(false); }} className="p-4 bg-[#111111] border border-[#1F1F1F] rounded-2xl text-left font-medium active:bg-[#1A1A1A]">Reset Balance (All TX)</button>
              <button onClick={() => onReset('ALL')} className="p-4 bg-red-500 text-white rounded-2xl text-center font-bold shadow-lg shadow-red-500/20">Emergency Factory Reset</button>
            </div>

            <button onClick={() => setShowResetModal(false)} className="w-full py-4 text-[#B0B0B0] font-medium">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
