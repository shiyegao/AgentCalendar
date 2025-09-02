import React, { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, getMonth } from 'date-fns';
import { useCalendarStore } from '../stores/calendarStore';
import { BarChart3, TrendingUp, Activity, Clock, Calendar, Target } from 'lucide-react';
import { CalendarEvent } from '../types/calendar';

interface StatsViewProps {
  viewMode: 'month' | 'year';
  date: Date;
}

const StatsView: React.FC<StatsViewProps> = ({ viewMode, date }) => {
  const { theme, events, fetchEvents } = useCalendarStore();
  const [stats, setStats] = useState({
    totalHours: 0,
    completedTasks: 0,
    productivityScore: 0,
    monthlyData: [] as { month: string; hours: number; tasks: number }[],
    categoryBreakdown: {} as Record<string, number>,
    timeDistribution: { morning: 0, afternoon: 0, evening: 0 }
  });

  useEffect(() => {
    const loadStats = async () => {
      const startDate = viewMode === 'month' ? startOfMonth(date) : startOfYear(date);
      const endDate = viewMode === 'month' ? endOfMonth(date) : endOfYear(date);
      
      await fetchEvents(startDate, endDate);
      calculateStats(startDate, endDate);
    };
    
    loadStats();
  }, [date, viewMode, fetchEvents]);

  const calculateStats = (startDate: Date, endDate: Date) => {
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    let totalHours = 0;
    let completedTasks = 0;
    let totalProductivity = 0;
    const monthlyData: { month: string; hours: number; tasks: number }[] = [];
    const categoryBreakdown: Record<string, number> = {};
    const timeDistribution = { morning: 0, afternoon: 0, evening: 0 };

    // 按月份分组统计
    const monthGroups: Record<string, { hours: number; tasks: number }> = {};

    days.forEach(day => {
      const dayEvents = events.filter(e => e.date === format(day, 'yyyy-MM-dd'));
      const monthKey = format(day, 'yyyy-MM');
      
      if (!monthGroups[monthKey]) {
        monthGroups[monthKey] = { hours: 0, tasks: 0 };
      }

      dayEvents.forEach(event => {
        // 统计时间段使用情况
        const timeSlots = [
          'morning_7_8', 'morning_8_9', 'morning_9_10', 'morning_10_11', 'morning_11_12',
          'afternoon_12_13', 'afternoon_13_14', 'afternoon_14_15', 'afternoon_15_16', 'afternoon_16_17', 'afternoon_17_18',
          'evening_18_19', 'evening_19_20', 'evening_20_21', 'evening_21_22', 'evening_22_23', 'evening_23_24'
        ];

        timeSlots.forEach(slot => {
          if (event[slot as keyof CalendarEvent]) {
            totalHours++;
            monthGroups[monthKey].hours++;

            if (slot.startsWith('morning')) timeDistribution.morning++;
            else if (slot.startsWith('afternoon')) timeDistribution.afternoon++;
            else if (slot.startsWith('evening')) timeDistribution.evening++;

            // 分类统计
            const content = event[slot as keyof CalendarEvent] as string;
            if (content) {
              const category = detectCategory(content);
              categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
            }
          }
        });

        // 统计完成的任务
        if (event.morning_completed) {
          completedTasks++;
          monthGroups[monthKey].tasks++;
        }
        if (event.afternoon_completed) {
          completedTasks++;
          monthGroups[monthKey].tasks++;
        }
        if (event.evening_completed) {
          completedTasks++;
          monthGroups[monthKey].tasks++;
        }

        if (event.productivity_score) {
          totalProductivity += event.productivity_score;
        }
      });
    });

    // 转换月度数据
    Object.entries(monthGroups).forEach(([month, data]) => {
      monthlyData.push({
        month: format(new Date(month), viewMode === 'year' ? 'MMM' : 'MM/dd'),
        hours: data.hours,
        tasks: data.tasks
      });
    });

    setStats({
      totalHours,
      completedTasks,
      productivityScore: events.length > 0 ? totalProductivity / events.length : 0,
      monthlyData: monthlyData.slice(0, 12), // 最多显示12个数据点
      categoryBreakdown,
      timeDistribution
    });
  };

  const detectCategory = (content: string): string => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('会议') || lowerContent.includes('meeting')) return '会议';
    if (lowerContent.includes('学习') || lowerContent.includes('study')) return '学习';
    if (lowerContent.includes('工作') || lowerContent.includes('work')) return '工作';
    if (lowerContent.includes('运动') || lowerContent.includes('exercise')) return '运动';
    if (lowerContent.includes('休息') || lowerContent.includes('rest')) return '休息';
    return '其他';
  };

  const getMaxValue = (data: number[]) => Math.max(...data, 1);

  const renderBarChart = (data: { label: string; value: number }[], color: string) => {
    const maxValue = getMaxValue(data.map(d => d.value));
    
    return (
      <div className="flex items-end gap-2 h-32">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full relative" style={{ height: '100px' }}>
              <div
                className={`absolute bottom-0 w-full rounded-t transition-all hover:opacity-80`}
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: color,
                  minHeight: item.value > 0 ? '4px' : '0'
                }}
              />
            </div>
            <span className={`text-xs mt-1 ${theme.mode === 'geek' ? 'text-geek-muted' : 'text-gray-500'}`}>
              {item.label}
            </span>
            <span className={`text-xs font-bold ${theme.mode === 'geek' ? 'text-geek-primary' : 'text-blue-600'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderPieChart = (data: Record<string, number>) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    const colors = theme.mode === 'geek' 
      ? ['#00ff00', '#00ffff', '#ff00ff', '#ffff00', '#ff6600', '#0099ff']
      : ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    
    let currentAngle = 0;
    const segments = Object.entries(data).map(([key, value], index) => {
      const percentage = (value / total) * 100;
      const angle = (percentage / 100) * 360;
      const segment = {
        key,
        value,
        percentage,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        color: colors[index % colors.length]
      };
      currentAngle += angle;
      return segment;
    });

    return (
      <div className="flex items-center gap-4">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {segments.map((segment, index) => {
              const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0;
              const x1 = 50 + 40 * Math.cos((segment.startAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((segment.startAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos((segment.endAngle * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin((segment.endAngle * Math.PI) / 180);
              
              return (
                <path
                  key={index}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={segment.color}
                  className="hover:opacity-80 transition-opacity"
                />
              );
            })}
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: segment.color }} />
              <span className={`text-xs ${theme.mode === 'geek' ? 'text-geek-text' : 'text-gray-700'}`}>
                {segment.key}: {segment.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`p-6 space-y-6 ${theme.mode === 'geek' ? 'font-mono' : ''}`}>
      {/* 标题 */}
      <div className={`text-2xl font-bold ${theme.mode === 'geek' ? 'text-geek-primary' : 'text-gray-800'}`}>
        {viewMode === 'month' ? format(date, 'yyyy年MM月') : format(date, 'yyyy年')} 统计概览
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg ${
          theme.mode === 'geek' 
            ? 'bg-geek-surface/50 border border-geek-primary/30' 
            : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className={theme.mode === 'geek' ? 'text-geek-secondary' : 'text-blue-500'} size={20} />
            <span className={`text-sm ${theme.mode === 'geek' ? 'text-geek-muted' : 'text-gray-600'}`}>
              总时长
            </span>
          </div>
          <div className={`text-2xl font-bold ${theme.mode === 'geek' ? 'text-geek-text' : 'text-gray-800'}`}>
            {stats.totalHours} 小时
          </div>
        </div>

        <div className={`p-4 rounded-lg ${
          theme.mode === 'geek' 
            ? 'bg-geek-surface/50 border border-geek-primary/30' 
            : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Target className={theme.mode === 'geek' ? 'text-geek-secondary' : 'text-green-500'} size={20} />
            <span className={`text-sm ${theme.mode === 'geek' ? 'text-geek-muted' : 'text-gray-600'}`}>
              完成任务
            </span>
          </div>
          <div className={`text-2xl font-bold ${theme.mode === 'geek' ? 'text-geek-text' : 'text-gray-800'}`}>
            {stats.completedTasks} 个
          </div>
        </div>

        <div className={`p-4 rounded-lg ${
          theme.mode === 'geek' 
            ? 'bg-geek-surface/50 border border-geek-primary/30' 
            : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={theme.mode === 'geek' ? 'text-geek-secondary' : 'text-purple-500'} size={20} />
            <span className={`text-sm ${theme.mode === 'geek' ? 'text-geek-muted' : 'text-gray-600'}`}>
              效率评分
            </span>
          </div>
          <div className={`text-2xl font-bold ${theme.mode === 'geek' ? 'text-geek-text' : 'text-gray-800'}`}>
            {stats.productivityScore.toFixed(1)}
          </div>
        </div>
      </div>

      {/* 时间段分布图 */}
      <div className={`p-4 rounded-lg ${
        theme.mode === 'geek' 
          ? 'bg-geek-surface/30 border border-geek-primary/20' 
          : 'bg-white border border-gray-200 shadow-sm'
      }`}>
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
          theme.mode === 'geek' ? 'text-geek-secondary' : 'text-gray-700'
        }`}>
          <Activity size={20} />
          时间段分布
        </h3>
        {renderBarChart([
          { label: '早晨', value: stats.timeDistribution.morning },
          { label: '下午', value: stats.timeDistribution.afternoon },
          { label: '晚上', value: stats.timeDistribution.evening }
        ], theme.mode === 'geek' ? '#00ff00' : '#3b82f6')}
      </div>

      {/* 月度/日度趋势图 */}
      <div className={`p-4 rounded-lg ${
        theme.mode === 'geek' 
          ? 'bg-geek-surface/30 border border-geek-primary/20' 
          : 'bg-white border border-gray-200 shadow-sm'
      }`}>
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
          theme.mode === 'geek' ? 'text-geek-secondary' : 'text-gray-700'
        }`}>
          <BarChart3 size={20} />
          {viewMode === 'year' ? '月度' : '日度'}趋势
        </h3>
        {stats.monthlyData.length > 0 && renderBarChart(
          stats.monthlyData.map(d => ({ label: d.month, value: d.hours })),
          theme.mode === 'geek' ? '#00ffff' : '#10b981'
        )}
      </div>

      {/* 分类统计饼图 */}
      {Object.keys(stats.categoryBreakdown).length > 0 && (
        <div className={`p-4 rounded-lg ${
          theme.mode === 'geek' 
            ? 'bg-geek-surface/30 border border-geek-primary/20' 
            : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
            theme.mode === 'geek' ? 'text-geek-secondary' : 'text-gray-700'
          }`}>
            <Calendar size={20} />
            活动分类
          </h3>
          {renderPieChart(stats.categoryBreakdown)}
        </div>
      )}
    </div>
  );
};

export default StatsView;