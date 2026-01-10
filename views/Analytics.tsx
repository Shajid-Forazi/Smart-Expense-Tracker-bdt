
import React, { useMemo, useState } from 'react';
import { AppState } from '../types';
import Card from '../components/Card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, TrendingDown, Target, Info, BarChart3, Activity } from 'lucide-react';

interface AnalyticsProps {
  state: AppState;
}

type TimeRange = 'Daily' | 'Weekly' | 'Monthly';

// Custom Marker component to match the 'X' in the user's image
const CustomMarker = (props: any) => {
  const { cx, cy, stroke } = props;
  return (
    <g transform={`translate(${cx - 4}, ${cy - 4})`}>
      <line x1="0" y1="0" x2="8" y2="8" stroke={stroke} strokeWidth="2" />
      <line x1="8" y1="0" x2="0" y2="8" stroke={stroke} strokeWidth="2" />
    </g>
  );
};

const Analytics: React.FC<AnalyticsProps> = ({ state }) => {
  const { transactions, categories } = state;
  const [range, setRange] = useState<TimeRange>('Daily');

  const filteredExpenses = useMemo(() => {
    return transactions.filter(t => t.type === 'EXPENSE');
  }, [transactions]);

  const categoryData = useMemo(() => {
    const groupMap: Record<string, number> = {};
    filteredExpenses.forEach(t => {
      const cat = categories.find(c => c.id === t.categoryId)?.name || 'Other';
      groupMap[cat] = (groupMap[cat] || 0) + t.amount;
    });
    return Object.entries(groupMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredExpenses, categories]);

  const chartData = useMemo(() => {
    const today = new Date();
    
    if (range === 'Daily') {
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const amount = transactions
          .filter(t => t.date.split('T')[0] === dateStr && t.type === 'EXPENSE')
          .reduce((sum, t) => sum + t.amount, 0);
        return { 
          name: d.toLocaleDateString(undefined, { weekday: 'short' }), 
          amount 
        };
      }).reverse();
    }

    if (range === 'Weekly') {
      return Array.from({ length: 4 }, (_, i) => {
        const start = new Date();
        start.setDate(today.getDate() - (i + 1) * 7);
        const end = new Date();
        end.setDate(today.getDate() - i * 7);
        
        const amount = transactions
          .filter(t => {
            const d = new Date(t.date);
            return d >= start && d <= end && t.type === 'EXPENSE';
          })
          .reduce((sum, t) => sum + t.amount, 0);
        return { name: `W${4-i}`, amount };
      }).reverse();
    }

    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(today.getMonth() - i);
      const month = d.getMonth();
      const year = d.getFullYear();
      
      const amount = transactions
        .filter(t => {
          const dt = new Date(t.date);
          return dt.getMonth() === month && dt.getFullYear() === year && t.type === 'EXPENSE';
        })
        .reduce((sum, t) => sum + t.amount, 0);
      return { 
        name: d.toLocaleDateString(undefined, { month: 'short' }), 
        amount 
      };
    }).reverse();
  }, [transactions, range]);

  const totalRangeExpense = chartData.reduce((sum, item) => sum + item.amount, 0);
  const totalAllTimeExpense = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center mt-2">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex bg-[#0E1621] p-1 rounded-xl border border-[#1F1F1F]">
            {(['Daily', 'Weekly', 'Monthly'] as TimeRange[]).map(r => (
                <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${range === r ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-gray-500'}`}
                >
                    {r}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
          <Card className="flex flex-col items-center justify-center py-5 space-y-1 bg-[#0E1621] border-l-2 border-l-emerald-500">
              <Activity size={18} className="text-emerald-500 mb-1" />
              <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Period Total</p>
              <p className="font-bold text-xl">৳{totalRangeExpense.toLocaleString()}</p>
          </Card>
          <Card className="flex flex-col items-center justify-center py-5 space-y-1 bg-[#0E1621] border-l-2 border-l-cyan-500">
              <BarChart3 size={18} className="text-cyan-500 mb-1" />
              <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Global Expense</p>
              <p className="font-bold text-xl">৳{totalAllTimeExpense.toLocaleString()}</p>
          </Card>
      </div>

      {/* Main Trends Chart - The requested Line Graph */}
      <Card className="h-72 bg-[#0A0A0A] p-4 relative overflow-hidden border-[#1F1F1F]">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center">
            <Activity size={12} className="mr-2 text-cyan-500" /> Expense Trends
        </h3>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#1A1A1A" vertical={true} horizontal={true} strokeDasharray="1 1" />
            <XAxis 
                dataKey="name" 
                stroke="#444444" 
                fontSize={10} 
                axisLine={false} 
                tickLine={false} 
                dy={10}
            />
            <YAxis 
                stroke="#444444" 
                fontSize={10} 
                axisLine={false} 
                tickLine={false} 
            />
            <Tooltip 
              cursor={{ stroke: '#06B6D4', strokeWidth: 1, strokeDasharray: '5 5' }}
              contentStyle={{ backgroundColor: '#000000', border: '1px solid #1F1F1F', borderRadius: '12px', fontSize: '12px' }}
              itemStyle={{ color: '#06B6D4', fontWeight: 'bold' }}
              labelStyle={{ color: '#B0B0B0', marginBottom: '4px' }}
              formatter={(value) => [`৳${value.toLocaleString()}`, 'Spent']}
            />
            <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#06B6D4" 
                strokeWidth={3} 
                dot={<CustomMarker stroke="#06B6D4" />}
                activeDot={{ r: 6, fill: '#06B6D4', stroke: '#000000', strokeWidth: 2 }}
                animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Category Breakdown */}
      <div className="space-y-4 pb-6">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Top Spending Categories</h3>
        <div className="grid grid-cols-1 gap-3">
          {categoryData.length === 0 ? (
            <div className="text-center py-10 text-gray-800 text-xs italic bg-[#0E1621] rounded-2xl border border-dashed border-[#1F1F1F]">No data recorded</div>
          ) : (
            categoryData.map((item, idx) => {
              const cat = categories.find(c => c.name === item.name);
              return (
                <div key={idx} className="flex items-center justify-between p-4 bg-[#0E1621]/50 border border-[#1F1F1F] rounded-2xl transition-transform active:scale-[0.98]">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner" 
                      style={{ backgroundColor: `${cat?.color}15`, border: `1.5px solid ${cat?.color}30` }}
                    >
                      {cat?.icon}
                    </div>
                    <div>
                        <span className="text-sm font-bold text-white">{item.name}</span>
                        <div className="w-24 h-1 bg-black rounded-full mt-1.5 overflow-hidden">
                            <div 
                                className="h-full bg-cyan-500 rounded-full" 
                                style={{ width: `${Math.round((item.value / (totalAllTimeExpense || 1)) * 100)}%` }}
                            />
                        </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">৳{item.value.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                        {Math.round((item.value / (totalAllTimeExpense || 1)) * 100)}% Share
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
