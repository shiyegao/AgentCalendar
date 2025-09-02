import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Calendar } from 'lucide-react';
import { format, addDays, addWeeks, addMonths, addYears, startOfWeek } from 'date-fns';
import { useCalendarStore } from '../stores/calendarStore';

const DateNavigator: React.FC = () => {
  const { currentView, setView, theme, selectedDate, setSelectedDate } = useCalendarStore();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [inputDate, setInputDate] = useState('');
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleDateClick = () => {
    setShowDatePicker(!showDatePicker);
    setInputDate(format(currentView.date, 'yyyy-MM-dd'));
  };

  const handleDateSubmit = () => {
    const newDate = new Date(inputDate);
    if (!isNaN(newDate.getTime())) {
      setView({ ...currentView, date: newDate });
      setSelectedDate(newDate);
      setShowDatePicker(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDateSubmit();
    }
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

      {/* 当前日期范围 - 可点击选择日期 */}
      <div className="relative" ref={datePickerRef}>
        <button
          onClick={handleDateClick}
          className={`
            px-4 py-2 rounded-lg font-bold text-lg flex items-center gap-2 transition-all
            ${theme.mode === 'geek' 
              ? 'bg-geek-surface text-geek-text font-mono border border-geek-primary/30 hover:border-geek-primary/50 hover:bg-geek-primary/5' 
              : 'bg-minimal-surface text-minimal-text border border-minimal-secondary/20 hover:border-minimal-primary/50 hover:bg-minimal-primary/5'
            }
          `}
        >
          <Calendar size={18} className="opacity-70" />
          {formatDateRange()}
        </button>

        {/* 日期选择器下拉框 */}
        {showDatePicker && (
          <div className={`
            absolute top-full mt-2 left-0 z-50 p-4 rounded-lg shadow-xl
            ${theme.mode === 'geek'
              ? 'bg-geek-surface border-2 border-geek-primary/50'
              : 'bg-white border border-gray-300'
            }
          `}>
            <div className="flex flex-col gap-3">
              <label className={`text-sm font-medium ${
                theme.mode === 'geek' ? 'text-geek-secondary' : 'text-gray-600'
              }`}>
                选择日期：
              </label>
              <input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`
                  px-3 py-2 rounded border focus:outline-none focus:ring-2
                  ${theme.mode === 'geek'
                    ? 'bg-geek-bg text-geek-text border-geek-primary/30 focus:ring-geek-primary/50'
                    : 'bg-white text-gray-800 border-gray-300 focus:ring-blue-500'
                  }
                `}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDateSubmit}
                  className={`
                    flex-1 px-3 py-1.5 rounded text-sm font-medium transition-all
                    ${theme.mode === 'geek'
                      ? 'bg-geek-primary/20 text-geek-primary hover:bg-geek-primary/30'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                    }
                  `}
                >
                  跳转
                </button>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className={`
                    flex-1 px-3 py-1.5 rounded text-sm font-medium transition-all
                    ${theme.mode === 'geek'
                      ? 'bg-geek-surface text-geek-muted border border-geek-primary/20 hover:bg-geek-primary/10'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateNavigator;