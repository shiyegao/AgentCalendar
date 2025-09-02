import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { format, addDays, addWeeks, addMonths, addYears, startOfWeek } from 'date-fns';
import { useCalendarStore } from '../stores/calendarStore';

const DateNavigator: React.FC = () => {
  const { currentView, setView, theme, selectedDate, setSelectedDate } = useCalendarStore();

  const navigate = (direction: 'prev' | 'next') => {
    let newDate: Date;
    
    switch (currentView.type) {
      case 'day':
        newDate = addDays(currentView.date, direction === 'next' ? 1 : -1);
        break;
      case 'week':
        newDate = addWeeks(currentView.date, direction === 'next' ? 1 : -1);
        break;
      case 'month':
        newDate = addMonths(currentView.date, direction === 'next' ? 1 : -1);
        break;
      case 'year':
        newDate = addYears(currentView.date, direction === 'next' ? 1 : -1);
        break;
      default:
        newDate = currentView.date;
    }
    
    setView({ ...currentView, date: newDate });
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setView({ ...currentView, date: today });
    setSelectedDate(today);
  };

  const formatDateRange = () => {
    const date = currentView.date;
    
    switch (currentView.type) {
      case 'day':
        return format(date, 'yyyy年MM月dd日 EEEE');
      case 'week': {
        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
        const weekEnd = addDays(weekStart, 6);
        return `${format(weekStart, 'yyyy年MM月dd日')} - ${format(weekEnd, 'MM月dd日')}`;
      }
      case 'month':
        return format(date, 'yyyy年MM月');
      case 'year':
        return format(date, 'yyyy年');
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* 导航按钮 */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => navigate('prev')}
          className={`
            p-2 rounded-lg transition-all hover:scale-105
            ${theme.mode === 'geek' 
              ? 'bg-geek-surface text-geek-primary hover:bg-geek-primary/10 border border-geek-primary/20' 
              : 'bg-minimal-surface text-minimal-primary hover:bg-minimal-primary/10 border border-minimal-secondary/20'
            }
          `}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={goToToday}
          className={`
            px-4 py-2 rounded-lg transition-all font-medium
            ${theme.mode === 'geek' 
              ? 'bg-geek-surface text-geek-secondary hover:bg-geek-secondary/10 border border-geek-secondary/20' 
              : 'bg-minimal-surface text-minimal-secondary hover:bg-minimal-secondary/10 border border-minimal-secondary/20'
            }
          `}
        >
          <RotateCcw size={16} className="inline mr-1" />
          <span className={theme.mode === 'geek' ? 'font-mono text-sm' : 'text-sm'}>今天</span>
        </button>

        <button
          onClick={() => navigate('next')}
          className={`
            p-2 rounded-lg transition-all hover:scale-105
            ${theme.mode === 'geek' 
              ? 'bg-geek-surface text-geek-primary hover:bg-geek-primary/10 border border-geek-primary/20' 
              : 'bg-minimal-surface text-minimal-primary hover:bg-minimal-primary/10 border border-minimal-secondary/20'
            }
          `}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 当前日期范围 */}
      <div className={`
        px-4 py-2 rounded-lg font-bold text-lg
        ${theme.mode === 'geek' 
          ? 'bg-geek-surface text-geek-text font-mono border border-geek-primary/30' 
          : 'bg-minimal-surface text-minimal-text border border-minimal-secondary/20'
        }
      `}>
        {formatDateRange()}
      </div>
    </div>
  );
};

export default DateNavigator;