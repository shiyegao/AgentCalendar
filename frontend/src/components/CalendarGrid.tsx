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
    getEventsForDate,
    selectedDate
  } = useCalendarStore();

  const [editingCell, setEditingCell] = useState<{ date: Date; timeSlot: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    // 使用 selectedDate 确保一致性
    const baseDate = selectedDate;
    const endDate = viewMode === 'week' ? addDays(startOfWeek(baseDate, { weekStartsOn: 1 }), 6) : baseDate;
    fetchEvents(baseDate, endDate);
  }, [selectedDate, viewMode, fetchEvents]);

  const getDays = () => {
    // 使用 selectedDate 确保一致性
    const baseDate = selectedDate;
    if (viewMode === 'day') return [baseDate];
    if (viewMode === 'week') {
      const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 });
      return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    }
    return [baseDate];
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
      // 如果保存失败，不要关闭编辑状态，让用户重试
      return;
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
        case 'morning': return 'bg-gradient-to-r from-yellow-800/60 via-yellow-700/50 to-yellow-600/40 border-yellow-400/70 shadow-inner shadow-yellow-900/20';
        case 'afternoon': return 'bg-gradient-to-r from-green-800/60 via-green-700/50 to-green-600/40 border-green-400/70 shadow-inner shadow-green-900/20';
        case 'evening': return 'bg-gradient-to-r from-blue-800/60 via-blue-700/50 to-blue-600/40 border-blue-400/70 shadow-inner shadow-blue-900/20';
      }
    } else {
      switch (period) {
        case 'morning': return 'bg-gradient-to-r from-yellow-200/90 via-yellow-100 to-yellow-50/80 border-yellow-400/90 shadow-inner shadow-yellow-300/30';
        case 'afternoon': return 'bg-gradient-to-r from-green-200/90 via-green-100 to-green-50/80 border-green-400/90 shadow-inner shadow-green-300/30';
        case 'evening': return 'bg-gradient-to-r from-blue-200/90 via-blue-100 to-blue-50/80 border-blue-400/90 shadow-inner shadow-blue-300/30';
      }
    }
  };

  const days = getDays();

  return (
    <div className={`w-full h-full overflow-auto relative ${theme.mode === 'geek' ? 'bg-geek-bg' : 'bg-minimal-bg'}`}>
      {/* 主背景装饰图案 */}
      <div className={`absolute inset-0 opacity-8 ${
        theme.mode === 'geek'
          ? 'bg-gradient-to-br from-geek-primary/20 via-transparent to-geek-secondary/10'
          : 'bg-gradient-to-br from-blue-300/20 via-transparent to-purple-200/10'
      } pointer-events-none`}></div>

      {/* 网格背景纹理 */}
      <div className={`absolute inset-0 opacity-3 pointer-events-none ${
        theme.mode === 'geek' ? 'bg-geek-primary/5' : 'bg-blue-400/5'
      }`}
      style={{
        backgroundImage: theme.mode === 'geek'
          ? `radial-gradient(circle at 1px 1px, rgba(0,255,0,0.15) 1px, transparent 0)`
          : `radial-gradient(circle at 1px 1px, rgba(59,130,246,0.1) 1px, transparent 0)`,
        backgroundSize: '20px 20px'
      }}></div>

      {/* 动态光效 */}
      <div className={`absolute top-0 left-0 right-0 h-px opacity-20 ${
        theme.mode === 'geek' ? 'bg-geek-primary' : 'bg-blue-400'
      } pointer-events-none animate-pulse`}></div>

      {/* 左侧边缘光效 */}
      <div className={`absolute top-0 left-0 bottom-0 w-px opacity-10 ${
        theme.mode === 'geek' ? 'bg-gradient-to-b from-geek-primary/50 to-transparent' : 'bg-gradient-to-b from-blue-400/50 to-transparent'
      } pointer-events-none`}></div>
      {/* 使用HTML表格确保正确的表格布局 */}
      <table className={`w-full border-collapse shadow-2xl rounded-lg overflow-hidden backdrop-blur-sm relative z-10 ${
        theme.mode === 'geek'
          ? 'border-geek-primary/70 shadow-geek-primary/10'
          : 'border-gray-600 shadow-gray-400/20'
      }`} style={{
        borderSpacing: 0,
        minWidth: '800px',
        border: '3px solid',
        boxShadow: theme.mode === 'geek'
          ? '0 25px 50px -12px rgba(0, 255, 0, 0.15), 0 0 0 1px rgba(0, 255, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      }}>
        
        {/* 表格头部 */}
        <thead>
          <tr>
            <th className={`w-24 p-3 text-sm font-bold text-center border-2 border-r-3 relative overflow-hidden ${
              theme.mode === 'geek'
                ? 'bg-gradient-to-br from-geek-surface via-geek-surface/90 to-geek-surface/70 text-geek-primary border-geek-primary/60 shadow-lg ring-1 ring-geek-primary/20'
                : 'bg-gradient-to-br from-gray-200 via-gray-150 to-gray-300 text-gray-900 border-gray-500 shadow-lg ring-1 ring-gray-300'
            }`}>
              {/* 顶部装饰条 */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${
                theme.mode === 'geek' ? 'bg-geek-primary/40' : 'bg-blue-500/40'
              }`}></div>

              {/* 时钟图标装饰 */}
              <div className={`absolute top-1 right-1 w-1 h-1 rounded-full animate-pulse ${
                theme.mode === 'geek' ? 'bg-geek-primary' : 'bg-blue-500'
              }`}></div>

              <span className="relative z-10">时间段</span>
            </th>
            {days.map((day, index) => (
              <th key={index} className={`p-3 text-sm font-bold text-center border-2 relative overflow-hidden ${
                theme.mode === 'geek'
                  ? 'bg-gradient-to-br from-geek-surface via-geek-surface/90 to-geek-surface/70 text-geek-primary border-geek-primary/60 shadow-lg ring-1 ring-geek-primary/20'
                  : 'bg-gradient-to-br from-gray-200 via-gray-150 to-gray-300 text-gray-900 border-gray-500 shadow-lg ring-1 ring-gray-300'
              }`}>
                {/* 顶部装饰条 */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${
                  theme.mode === 'geek' ? 'bg-geek-primary/40' : 'bg-blue-500/40'
                }`}></div>

                {/* 日期装饰点 */}
                <div className={`absolute top-1 left-1 w-1 h-1 rounded-full ${
                  isSameDay(day, new Date())
                    ? (theme.mode === 'geek' ? 'bg-geek-primary animate-pulse' : 'bg-blue-500 animate-pulse')
                    : (theme.mode === 'geek' ? 'bg-geek-primary/30' : 'bg-blue-500/30')
                }`}></div>

                <div className="relative z-10">
                  <div className={`${theme.mode === 'geek' ? 'font-mono' : ''}`}>
                    {format(day, 'MM-dd')}
                  </div>
                  <div className="text-xs opacity-70 mt-1">
                    {format(day, 'EEE')}
                  </div>
                </div>

                {/* 右下角微装饰 */}
                <div className={`absolute bottom-0 right-0 w-2 h-2 ${
                  theme.mode === 'geek'
                    ? 'bg-gradient-to-tl from-geek-primary/5 to-transparent'
                    : 'bg-gradient-to-tl from-blue-400/5 to-transparent'
                }`}></div>
              </th>
            ))}
          </tr>
        </thead>

        {/* 表格主体 */}
        <tbody>
          {TIME_SLOTS.map((slot, rowIndex) => (
            <tr key={slot.key}>
              {/* 时间标签列 */}
              <td className={`w-24 p-3 text-xs font-medium text-center border-2 border-r-3 relative overflow-hidden ${
                theme.mode === 'geek'
                  ? 'bg-gradient-to-r from-geek-surface/70 via-geek-surface/50 to-geek-surface/30 text-geek-text border-geek-primary/60 shadow-md ring-1 ring-geek-primary/10'
                  : 'bg-gradient-to-r from-gray-100 via-gray-75 to-gray-50 text-gray-800 border-gray-500 shadow-md ring-1 ring-gray-200'
              } ${getCellPeriodColor(slot.period)}`}>
                {/* 时间段装饰点 */}
                <div className={`absolute top-1 left-1 w-1.5 h-1.5 rounded-full ${
                  theme.mode === 'geek' ? 'bg-geek-primary/60' : 'bg-blue-500/60'
                }`}></div>

                <span className={`${theme.mode === 'geek' ? 'font-mono' : ''} relative z-10`}>
                  {slot.label}
                </span>

                {/* 右下角装饰 */}
                <div className={`absolute bottom-0 right-0 w-3 h-3 ${
                  theme.mode === 'geek'
                    ? 'bg-gradient-to-tl from-geek-primary/10 to-transparent'
                    : 'bg-gradient-to-tl from-blue-400/10 to-transparent'
                }`}></div>
              </td>

              {/* 内容单元格 */}
              {days.map((day, dayIndex) => {
                const isEditing = editingCell?.date && isSameDay(editingCell.date, day) && editingCell.timeSlot === slot.key;
                const cellValue = getCellValue(day, slot.key);

                return (
                  <td key={dayIndex} className={`border-2 p-0 relative group/cell ${
                    theme.mode === 'geek'
                      ? 'bg-gradient-to-br from-geek-bg via-geek-bg/90 to-geek-bg/70 hover:from-geek-surface/60 hover:via-geek-surface/40 hover:to-geek-surface/20 hover:shadow-2xl hover:scale-[1.04] hover:z-20 border-geek-primary/50 hover:border-geek-primary/90'
                      : 'bg-gradient-to-br from-white via-gray-50/30 to-gray-100/20 hover:from-blue-50/80 hover:via-blue-100/40 hover:to-blue-150/30 hover:shadow-2xl hover:scale-[1.04] hover:z-20 border-gray-400 hover:border-blue-500'
                  } transition-all duration-500 ease-out cursor-pointer transform-gpu backdrop-blur-sm`}
                  style={{
                    minHeight: '50px',
                    height: '50px',
                    transformStyle: 'preserve-3d'
                  }}>
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
                        className="p-2 h-full cursor-pointer group flex items-start min-h-[46px] relative overflow-hidden"
                        onClick={() => handleCellClick(day, slot.key)}
                      >
                        {/* 装饰性背景图案 */}
                        <div className={`absolute inset-0 opacity-0 group/cell-hover:opacity-30 transition-all duration-500 ${
                          theme.mode === 'geek'
                            ? 'bg-gradient-to-br from-geek-primary/15 via-geek-primary/8 to-transparent'
                            : 'bg-gradient-to-br from-blue-400/15 via-blue-400/8 to-transparent'
                        }`}></div>

                        {/* 左边发光装饰线 */}
                        <div className={`absolute left-0 top-0 w-1 h-full opacity-0 group/cell-hover:opacity-80 transition-all duration-500 ${
                          theme.mode === 'geek'
                            ? 'bg-gradient-to-b from-geek-primary via-geek-primary/80 to-geek-primary/20 shadow-lg shadow-geek-primary/50'
                            : 'bg-gradient-to-b from-blue-500 via-blue-500/80 to-blue-500/20 shadow-lg shadow-blue-500/50'
                        } animate-pulse`}></div>

                        {/* 顶部微光效果 */}
                        <div className={`absolute top-0 left-0 right-0 h-0.5 opacity-0 group/cell-hover:opacity-60 transition-all duration-500 delay-100 ${
                          theme.mode === 'geek'
                            ? 'bg-gradient-to-r from-transparent via-geek-primary/60 to-transparent'
                            : 'bg-gradient-to-r from-transparent via-blue-400/60 to-transparent'
                        }`}></div>

                        {/* 右下角光晕效果 */}
                        <div className={`absolute bottom-0 right-0 w-4 h-4 opacity-0 group/cell-hover:opacity-40 transition-all duration-700 ${
                          theme.mode === 'geek'
                            ? 'bg-radial-gradient from-geek-primary/30 to-transparent rounded-full blur-sm'
                            : 'bg-radial-gradient from-blue-400/30 to-transparent rounded-full blur-sm'
                        }`}></div>

                        <div className={`text-xs w-full ${
                          theme.mode === 'geek' ? 'font-mono text-geek-text' : 'text-gray-800'
                        } break-words leading-tight relative z-10`}>
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
                            className={`ml-1 opacity-0 group-hover:opacity-70 transition-all duration-300 transform group-hover:scale-110 flex-shrink-0 ${
                              theme.mode === 'geek' ? 'text-geek-primary' : 'text-blue-500'
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