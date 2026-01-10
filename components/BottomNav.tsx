
import React from 'react';
import { ViewType } from '../types';
import { Home, List, PieChart, Calendar, Settings, Plus } from 'lucide-react';

interface BottomNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange }) => {
  const items = [
    { id: 'DASHBOARD', icon: Home, label: 'Home' },
    { id: 'CALENDAR', icon: Calendar, label: 'Calendar' },
    { id: 'ADD_TRANSACTION', icon: Plus, label: 'Add', isCenter: true },
    { id: 'ANALYTICS', icon: PieChart, label: 'Stats' },
    { id: 'TRANSACTIONS', icon: List, label: 'History' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/90 backdrop-blur-md border-t border-[#1F1F1F] px-4 pb-safe z-50">
      <div className="flex justify-between items-center h-16 max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as ViewType)}
                className="relative -top-6 bg-emerald-500 text-white p-4 rounded-full shadow-lg shadow-emerald-500/20 active:scale-90 transition-transform"
              >
                <Icon size={28} />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className="flex flex-col items-center justify-center space-y-1 transition-colors"
            >
              <Icon 
                size={22} 
                className={isActive ? 'text-emerald-500' : 'text-[#B0B0B0]'} 
              />
              <span className={`text-[10px] font-medium ${isActive ? 'text-emerald-500' : 'text-[#B0B0B0]'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
