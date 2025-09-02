import React, { useState, useEffect } from 'react';
import { format, isSameDay, addDays, startOfWeek } from 'date-fns';
import { useCalendarStore } from '../stores/calendarStore';
import { CalendarEvent, TIME_SLOTS } from '../types/calendar';
import { Edit3, Check, X } from 'lucide-react';

interface CalendarGridProps {
  viewMode: 'day' | 'week' | 'month';
  startDate: Date;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ viewMode, startDate }) => {
  const {
    events,
    theme,
    fetchEvents,
    updateEvent,
    createEvent,
    getEventsForDate
  } = useCalendarStore();

  const [editingCell, setEditingCell] = useState<{ date: Date; timeSlot: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const endDate = viewMode === 'week' ? addDays(startOfWeek(startDate, { weekStartsOn: 1 }), 6) : startDate;
    fetchEvents(startDate, endDate);
  }, [startDate, viewMode, fetchEvents]);

  const getDays = () => {
    if (viewMode === 'day') return [startDate];
    if (viewMode === 'week') {
      const weekStart = startOfWeek(startDate, { weekStartsOn: 1 });
      return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    }
    return [startDate];
  };

  const handleCellClick = (date: Date, timeSlot: string) => {
    const event = getEventsForDate(date)[0];
    const currentValue = event?.[timeSlot as keyof CalendarEvent] as string || '';
    setEditingCell({ date, timeSlot });
    setEditValue(currentValue);
  };

  const handleSaveCell = async () => {
    if (!editingCell) return;

    const { date, timeSlot } = editingCell;
    const events = getEventsForDate(date);
    const event = events[0];

    try {
      if (event?.id) {
        await updateEvent(event.id, {
          [timeSlot]: editValue
        });
      } else {
        await createEvent({
          date: format(date, 'yyyy-MM-dd'),
          title: `事件 ${format(date, 'MM-dd')}`,
          [timeSlot]: editValue
        });
      }
    } catch (error) {
      console.error('保存失败:', error);
    }

    setEditingCell(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const getCellValue = (date: Date, timeSlot: string): string => {
    const event = getEventsForDate(date)[0];
    return event?.[timeSlot as keyof CalendarEvent] as string || '';
  };

  const getCellStyle = (period: 'morning' | 'afternoon' | 'evening') => {
    const base = theme.mode === 'geek' 
      ? 'bg-geek-surface text-geek-text border-geek-primary/20'
      : 'bg-minimal-surface text-minimal-text border-minimal-secondary/20';
      
    const periodColors = theme.mode === 'geek' ? {
      morning: 'bg-yellow-900/20 border-yellow-500/30',
      afternoon: 'bg-green-900/20 border-green-500/30', 
      evening: 'bg-blue-900/20 border-blue-500/30'
    } : {
      morning: 'bg-yellow-50 border-yellow-200',
      afternoon: 'bg-green-50 border-green-200',
      evening: 'bg-blue-50 border-blue-200'
    };

    return `${base} ${periodColors[period]}`;
  };

  const getCellPeriodColor = (period: 'morning' | 'afternoon' | 'evening') => {
    if (theme.mode === 'geek') {
      switch (period) {
        case 'morning': return 'bg-yellow-900/10';
        case 'afternoon': return 'bg-green-900/10';
        case 'evening': return 'bg-blue-900/10';
      }
    } else {
      switch (period) {
        case 'morning': return 'bg-yellow-50';
        case 'afternoon': return 'bg-green-50';
        case 'evening': return 'bg-blue-50';
      }
    }
  };

  const days = getDays();

  return (
    <div className={`w-full h-full overflow-auto ${theme.mode === 'geek' ? 'bg-geek-bg' : 'bg-minimal-bg'}`}>
      {/* 使用HTML表格确保正确的表格布局 */}
      <table className={`w-full border-collapse ${
        theme.mode === 'geek' ? 'border-geek-primary/30' : 'border-gray-300'
      }`} style={{ borderSpacing: 0, minWidth: '800px' }}>
        
        {/* 表格头部 */}
        <thead>
          <tr>
            <th className={`w-24 p-3 text-sm font-bold text-center border border-r ${
              theme.mode === 'geek' 
                ? 'bg-geek-surface text-geek-primary border-geek-primary/30' 
                : 'bg-gray-100 text-gray-800 border-gray-300'
            }`}>
              时间段
            </th>
            {days.map((day, index) => (
              <th key={index} className={`p-3 text-sm font-bold text-center border ${
                theme.mode === 'geek' 
                  ? 'bg-geek-surface text-geek-primary border-geek-primary/30' 
                  : 'bg-gray-100 text-gray-800 border-gray-300'
              }`}>
                <div className={`${theme.mode === 'geek' ? 'font-mono' : ''}`}>
                  {format(day, 'MM-dd')}
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {format(day, 'EEE')}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* 表格主体 */}
        <tbody>
          {TIME_SLOTS.map((slot, rowIndex) => (
            <tr key={slot.key}>
              {/* 时间标签列 */}
              <td className={`w-24 p-3 text-xs font-medium text-center border border-r ${
                theme.mode === 'geek' 
                  ? 'bg-geek-surface/30 text-geek-text border-geek-primary/30' 
                  : 'bg-gray-50 text-gray-700 border-gray-300'
              } ${getCellPeriodColor(slot.period)}`}>
                <span className={`${theme.mode === 'geek' ? 'font-mono' : ''}`}>
                  {slot.label}
                </span>
              </td>

              {/* 内容单元格 */}
              {days.map((day, dayIndex) => {
                const isEditing = editingCell?.date && isSameDay(editingCell.date, day) && editingCell.timeSlot === slot.key;
                const cellValue = getCellValue(day, slot.key);

                return (
                  <td key={dayIndex} className={`border p-0 ${
                    theme.mode === 'geek' 
                      ? 'bg-geek-bg hover:bg-geek-surface/20 border-geek-primary/20' 
                      : 'bg-white hover:bg-gray-50 border-gray-200'
                  } transition-all`} style={{ minHeight: '50px', height: '50px' }}>
                    {isEditing ? (
                      <div className="p-2 h-full">
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className={`w-full h-8 p-1 text-xs border rounded resize-none ${
                            theme.mode === 'geek' 
                              ? 'bg-geek-surface text-geek-text border-geek-primary/30 font-mono' 
                              : 'bg-white text-gray-800 border-gray-300'
                          } focus:outline-none focus:ring-1 ${
                            theme.mode === 'geek' ? 'focus:ring-geek-primary' : 'focus:ring-blue-500'
                          }`}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSaveCell();
                            }
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          placeholder="输入内容..."
                        />
                        <div className="flex justify-end gap-1 mt-1">
                          <button
                            onClick={handleSaveCell}
                            className={`p-1 rounded text-xs ${
                              theme.mode === 'geek' 
                                ? 'bg-geek-primary text-geek-bg hover:bg-geek-primary/80'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            } transition-colors`}
                            title="保存 (Enter)"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className={`p-1 rounded text-xs ${
                              theme.mode === 'geek' 
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-red-500 text-white hover:bg-red-600'
                            } transition-colors`}
                            title="取消 (Esc)"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="p-2 h-full cursor-pointer group flex items-start min-h-[46px]"
                        onClick={() => handleCellClick(day, slot.key)}
                      >
                        <div className={`text-xs w-full ${
                          theme.mode === 'geek' ? 'font-mono text-geek-text' : 'text-gray-800'
                        } break-words leading-tight`}>
                          {cellValue || (
                            <span className={`${
                              theme.mode === 'geek' ? 'text-geek-muted' : 'text-gray-400'
                            } group-hover:text-gray-500 italic`}>
                              点击编辑
                            </span>
                          )}
                        </div>
                        {cellValue && (
                          <Edit3 
                            size={12} 
                            className={`ml-1 opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0 ${
                              theme.mode === 'geek' ? 'text-geek-primary' : 'text-gray-400'
                            }`}
                          />
                        )}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CalendarGrid;