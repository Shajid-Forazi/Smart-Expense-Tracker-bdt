
import React, { useMemo } from 'react';
import { AppState, Transaction, ViewType, Category } from '../types';
import Card from '../components/Card';
import { TrendingUp, TrendingDown, ChevronRight, List, Settings as SettingsIcon, AlertCircle, BellRing, Info } from 'lucide-react';

interface DashboardProps {
  state: AppState;
  onAddClick: () => void;
  onTransactionClick: (t: Transaction) => void;
  onViewChange: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onAddClick, onTransactionClick, onViewChange }) => {
  const { transactions, budget, categories } = state;

  const getCategory = (id: string) => categories.find(c => c.id === id);

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const totals = transactions.reduce((acc, t) => {
      const tDate = new Date(t.date);
      const isThisMonth = tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      const isToday = t.date.split('T')[0] === todayStr;

      if (t.type === 'INCOME') {
        if (isThisMonth) acc.monthlyIncome += t.amount;
        acc.totalIncome += t.amount;
      } else {
        if (isThisMonth) acc.monthlyExpense += t.amount;
        if (isToday) acc.todayExpense += t.amount;
        acc.totalExpense += t.amount;

        if (isThisMonth) {
            acc.catExpenses[t.categoryId] = (acc.catExpenses[t.categoryId] || 0) + t.amount;
        }
      }
      return acc;
    }, { 
      monthlyIncome: 0, monthlyExpense: 0, todayExpense: 0, 
      totalIncome: 0, totalExpense: 0, catExpenses: {} as Record<string, number> 
    });

    return totals;
  }, [transactions]);

  const balance = stats.totalIncome - stats.totalExpense;
  const recentTransactions = transactions.slice(0, 6);

  const monthlyBudgetUsage = budget.totalMonthly > 0 ? (stats.monthlyExpense / budget.totalMonthly) * 100 : 0;
  const dailyLimitUsage = budget.dailyLimit > 0 ? (stats.todayExpense / budget.dailyLimit) * 100 : 0;

  const budgetAlerts = useMemo(() => {
      return categories
        .filter(c => c.budget && c.budget > 0)
        .map(c => {
            const spent = stats.catExpenses[c.id] || 0;
            const usage = (spent / c.budget!) * 100;
            return { ...c, spent, usage };
        })
        .filter(c => c.usage >= 80)
        .sort((a, b) => b.usage - a.usage);
  }, [categories, stats.catExpenses]);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Daily Limit Warning Banner - Sticky at top if exceeded */}
      {dailyLimitUsage >= 100 && budget.dailyLimit > 0 && (
        <div className="sticky top-4 z-[60] bg-red-600 p-4 rounded-2xl flex items-center justify-between shadow-2xl shadow-red-500/40 animate-pulse">
            <div className="flex items-center space-x-3">
                <BellRing size={24} className="text-white flex-none" />
                <div>
                    <p className="text-[10px] font-black uppercase text-white/80 tracking-widest">Limit Alert</p>
                    <p className="text-xs font-bold text-white">Today's budget exceeded by ৳{(stats.todayExpense - budget.dailyLimit).toLocaleString()}</p>
                </div>
            </div>
            <button onClick={() => onViewChange('SETTINGS')} className="bg-black/20 p-2 rounded-lg text-white"><ChevronRight size={18} /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mt-2 px-1">
        <div>
          <h2 className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-1">Total Balance</h2>
          <h1 className="text-4xl font-bold tracking-tighter text-white">৳ {balance.toLocaleString()}</h1>
        </div>
        <button 
          onClick={() => onViewChange('SETTINGS')}
          className="bg-[#0E1621] text-gray-400 p-3.5 rounded-2xl border border-[#1F1F1F] active:scale-90 transition-transform"
        >
          <SettingsIcon size={20} />
        </button>
      </div>

      {/* Main Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col space-y-3 bg-[#0E1621]/40 border-l-2 border-emerald-500/50">
          <TrendingUp size={16} className="text-emerald-500" />
          <div>
            <p className="text-gray-500 text-[9px] uppercase font-black tracking-widest">Income</p>
            <p className="text-lg font-bold text-emerald-500">৳ {stats.monthlyIncome.toLocaleString()}</p>
          </div>
        </Card>
        <Card className="flex flex-col space-y-3 bg-[#0E1621]/40 border-l-2 border-red-500/50">
          <TrendingDown size={16} className="text-red-500" />
          <div>
            <p className="text-gray-500 text-[9px] uppercase font-black tracking-widest">Expenses</p>
            <p className="text-lg font-bold text-white">৳ {stats.monthlyExpense.toLocaleString()}</p>
          </div>
        </Card>
      </div>

      {/* Trackers Section */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Budget Trackers</h3>
        
        {/* Daily Tracker */}
        {budget.dailyLimit > 0 && (
            <Card className={`space-y-3 bg-[#0A0A0A] border-l-4 ${dailyLimitUsage >= 100 ? 'border-l-red-500 shadow-lg shadow-red-500/5' : 'border-l-cyan-500'}`}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <AlertCircle size={14} className={dailyLimitUsage >= 100 ? 'text-red-500' : 'text-cyan-500'} />
                        <h3 className="text-[11px] font-black uppercase tracking-wider text-white">Daily Spending</h3>
                    </div>
                    <span className={`text-xs font-bold ${dailyLimitUsage >= 100 ? 'text-red-500' : 'text-cyan-500'}`}>
                        {Math.round(dailyLimitUsage)}%
                    </span>
                </div>
                <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${dailyLimitUsage >= 100 ? 'bg-red-500' : 'bg-cyan-500'}`}
                        style={{ width: `${Math.min(100, dailyLimitUsage)}%` }}
                    />
                </div>
                <div className="flex justify-between text-[9px] font-bold text-gray-500">
                    <span>USED: ৳{stats.todayExpense.toLocaleString()}</span>
                    <span>LIMIT: ৳{budget.dailyLimit.toLocaleString()}</span>
                </div>
            </Card>
        )}

        {/* Monthly Tracker */}
        {budget.totalMonthly > 0 && (
            <Card className={`space-y-3 bg-[#0A0A0A] border-l-4 ${monthlyBudgetUsage >= 90 ? 'border-l-red-500' : 'border-l-emerald-500'}`}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <AlertCircle size={14} className={monthlyBudgetUsage >= 90 ? 'text-red-500' : 'text-emerald-500'} />
                        <h3 className="text-[11px] font-black uppercase tracking-wider text-white">Monthly Budget</h3>
                    </div>
                    <span className={`text-xs font-bold ${monthlyBudgetUsage >= 90 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {Math.round(monthlyBudgetUsage)}%
                    </span>
                </div>
                <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${monthlyBudgetUsage >= 90 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, monthlyBudgetUsage)}%` }}
                    />
                </div>
                <div className="flex justify-between text-[9px] font-bold text-gray-500">
                    <span>USED: ৳{stats.monthlyExpense.toLocaleString()}</span>
                    <span>GOAL: ৳{budget.totalMonthly.toLocaleString()}</span>
                </div>
            </Card>
        )}
      </div>

      {/* Category Budget Alerts */}
      {budgetAlerts.length > 0 && (
          <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Critical Categories</h3>
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                  {budgetAlerts.map(alert => (
                      <div 
                        key={alert.id} 
                        className={`flex-none w-52 bg-[#0E1621] p-5 rounded-[2rem] border-2 space-y-4 shadow-xl transition-all ${alert.usage >= 100 ? 'border-red-500/40 animate-pulse' : 'border-[#1F1F1F]'}`}
                      >
                          <div className="flex items-center justify-between">
                              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-2xl border border-[#1F1F1F]">
                                {alert.icon}
                              </div>
                              <div className="text-right">
                                  <p className={`text-[10px] font-black ${alert.usage >= 100 ? 'text-red-500' : 'text-orange-500'}`}>
                                      {Math.round(alert.usage)}%
                                  </p>
                                  <p className="text-[8px] text-gray-500 font-bold uppercase">Used</p>
                              </div>
                          </div>
                          <div>
                              <p className="text-xs font-black text-white truncate">{alert.name}</p>
                              <p className="text-[9px] text-gray-500 font-bold">Limit: ৳{alert.budget?.toLocaleString()}</p>
                          </div>
                          <div className="h-1 w-full bg-black rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${alert.usage >= 100 ? 'bg-red-500' : 'bg-orange-500'}`}
                                style={{ width: `${Math.min(100, alert.usage)}%` }}
                              />
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-bold text-gray-200">History</h3>
          <button 
            onClick={() => onViewChange('TRANSACTIONS')}
            className="text-emerald-500 text-[10px] font-bold flex items-center uppercase tracking-[0.2em]"
          >
            See All <ChevronRight size={14} className="ml-1" />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-800 space-y-4 bg-[#0A0A0A] border border-dashed border-[#1F1F1F] rounded-[3rem]">
            <div className="w-16 h-16 bg-[#111111] rounded-full flex items-center justify-center border border-[#1F1F1F]">
              <Info size={24} className="text-gray-600" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">No Activity Yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map(t => {
              const cat = getCategory(t.categoryId);
              return (
                <div 
                  key={t.id} 
                  onClick={() => onTransactionClick(t)}
                  className="flex items-center justify-between p-4 bg-[#0E1621]/30 border border-[#1F1F1F] rounded-3xl active:scale-[0.97] transition-all hover:border-[#333333]"
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${cat?.color}10`, border: `1px solid ${cat?.color}25` }}
                    >
                      {cat?.icon || '📦'}
                    </div>
                    <div className="max-w-[140px]">
                      <p className="font-bold text-sm text-white truncate">{cat?.name || 'General'}</p>
                      <p className="text-gray-600 text-[9px] truncate uppercase font-bold tracking-widest">{t.note || t.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${t.type === 'INCOME' ? 'text-emerald-500' : 'text-white'}`}>
                      {t.type === 'INCOME' ? '+' : '-'} ৳{t.amount.toLocaleString()}
                    </p>
                    <p className="text-gray-600 text-[9px] font-bold uppercase">{new Date(t.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
