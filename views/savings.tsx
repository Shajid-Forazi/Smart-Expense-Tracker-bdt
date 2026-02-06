
import React, { useState } from 'react';
import { AppState, ViewType, Saving } from '../types';
import Card from '../components/Card';
import {
    X,
    Check,
    Plus,
    Trash2,
    Target,
    ChevronLeft,
    Calendar
} from 'lucide-react';
import { useTranslation } from '../lib/i18n';

interface SavingsProps {
    state: AppState;
    onUpdateState: (updater: (prev: AppState) => AppState) => void;
    onViewChange: (view: ViewType) => void;
}

const Savings: React.FC<SavingsProps> = ({ state, onUpdateState, onViewChange }) => {
    const { t } = useTranslation(state.language);
    const { savings, selectedMonth } = state;
    const [showAdd, setShowAdd] = useState(false);
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');

    const handleAdd = () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) return;

        const newSaving: Saving = {
            id: Math.random().toString(36).substr(2, 9),
            amount: numAmount,
            month: selectedMonth,
            note,
            date: new Date().toISOString()
        };

        onUpdateState(prev => ({
            ...prev,
            savings: [newSaving, ...prev.savings]
        }));
        setShowAdd(false);
        setAmount('');
        setNote('');
    };

    const handleDelete = (id: string) => {
        onUpdateState(prev => ({
            ...prev,
            savings: prev.savings.filter(s => s.id !== id)
        }));
    };

    const monthSavings = savings.filter(s => s.month === selectedMonth);

    return (
        <div className="p-4 space-y-6 bg-black min-h-screen text-white pb-20 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mt-2">
                <div className="flex items-center space-x-3">
                    <button onClick={() => onViewChange('DASHBOARD')} className="p-2 bg-[#111111] rounded-full text-gray-400">
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold">{t('savings')}</h1>
                </div>
                <button
                    onClick={() => setShowAdd(true)}
                    className="bg-emerald-500 text-black p-3 rounded-2xl active:scale-90 transition-transform"
                >
                    <Plus size={20} />
                </button>
            </div>

            <div className="bg-[#0E1621] p-6 rounded-[2.5rem] border border-[#1F1F1F] text-center">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">{t('savings')} ({selectedMonth})</p>
                <h2 className="text-4xl font-bold text-emerald-500">৳ {monthSavings.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}</h2>
            </div>

            <div className="space-y-3">
                {monthSavings.length === 0 ? (
                    <div className="text-center py-20 bg-[#0A0A0A] border border-dashed border-[#1F1F1F] rounded-[2.5rem] text-gray-700">
                        <Target size={32} className="mx-auto mb-4 opacity-20" />
                        <p className="text-xs font-bold uppercase tracking-widest">{t('noActivity')}</p>
                    </div>
                ) : (
                    monthSavings.map(s => (
                        <div key={s.id} className="flex items-center justify-between p-4 bg-[#0E1621]/40 border border-[#1F1F1F] rounded-3xl">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                    <Target size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-white">৳ {s.amount.toLocaleString()}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{s.note || t('savings')}</p>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(s.id)} className="text-gray-600 hover:text-red-500 p-2">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {showAdd && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-6">
                    <div className="bg-[#0E1621] border border-[#1F1F1F] p-8 rounded-[3rem] w-full max-w-sm space-y-8 animate-in zoom-in duration-300">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-1">{t('add')} {t('savings')}</h2>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{selectedMonth}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="text-center">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    autoFocus
                                    className="bg-transparent text-5xl font-bold w-full focus:outline-none text-white placeholder-gray-800 text-center"
                                />
                                <p className="text-[10px] text-gray-600 font-bold mt-2 tracking-widest uppercase">Amount in BDT</p>
                            </div>

                            <div className="flex items-center space-x-4 bg-black/40 p-4 rounded-2xl border border-[#1F1F1F]">
                                <Calendar size={18} className="text-emerald-500" />
                                <input
                                    type="text"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder={t('note') + "..."}
                                    className="bg-transparent flex-1 text-sm focus:outline-none text-white"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setShowAdd(false)} className="flex-1 py-4 bg-[#1F1F1F] rounded-2xl font-bold text-sm">{t('cancel')}</button>
                            <button onClick={handleAdd} className="flex-1 py-4 bg-emerald-500 rounded-2xl font-bold text-sm text-black">{t('save')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Savings;
