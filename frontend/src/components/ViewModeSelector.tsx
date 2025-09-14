import React from 'react';
import { Calendar, Clock, CalendarDays, CalendarRange } from 'lucide-react';
import { useCalendarStore } from '../stores/calendarStore';

const ViewModeSelector: React.FC = () => {
  const { currentView, setView, theme, selectedDate, setSelectedDate } = useCalendarStore();

  const viewModes = [
    { type: 'day' as const, icon: Clock, label: '日' },
    { type: 'week' as const, icon: CalendarDays, label: '周' },
    { type: 'month' as const, icon: Calendar, label: '月' },
    { type: 'year' as const, icon: CalendarRange, label: '年' }
  ];

  const handleViewChange = (type: 'day' | 'week' | 'month' | 'year') => {
    // 确保 currentView 和 selectedDate 保持一致
    const newDate = selectedDate;
    setView({ type, date: newDate });
    setSelectedDate(newDate);
  };

  return (
    <div className={`
      flex rounded-lg p-1 gap-1 
      ${theme.mode === 'geek' 
        ? 'bg-geek-surface border border-geek-primary/20' 
        : 'bg-minimal-surface border border-minimal-secondary/20'
      }
    `}>
      {viewModes.map(({ type, icon: Icon, label }) => (
        <button
          key={type}
          onClick={() => handleViewChange(type)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium
            ${currentView.type === type
              ? theme.mode === 'geek'
                ? 'bg-geek-primary text-geek-bg shadow-lg shadow-geek-primary/30'
                : 'bg-minimal-primary text-white shadow-lg shadow-minimal-primary/30'
              : theme.mode === 'geek'
                ? 'text-geek-text hover:text-geek-primary hover:bg-geek-primary/10'
                : 'text-minimal-text hover:text-minimal-primary hover:bg-minimal-primary/10'
            }
          `}
        >
          <Icon size={16} />
          <span className={theme.mode === 'geek' ? 'font-mono' : ''}>{label}视图</span>
        </button>
      ))}
    </div>
  );
};

export default ViewModeSelector;