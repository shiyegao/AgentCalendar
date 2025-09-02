import React, { useEffect, useState } from 'react';
import { TrendingUp, Clock, Target, BarChart3 } from 'lucide-react';
import { useCalendarStore } from '../stores/calendarStore';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => {
  const { theme } = useCalendarStore();
  
  return (
    <div className={`
      p-4 rounded-lg border transition-all hover:shadow-lg
      ${theme.mode === 'geek' 
        ? 'bg-geek-surface border-geek-primary/20 hover:border-geek-primary/40' 
        : 'bg-minimal-surface border-minimal-secondary/20 hover:border-minimal-secondary/40'
      }
    `}>
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`
            flex items-center text-xs font-medium
            ${trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500'}
          `}>
            <TrendingUp size={12} className={trend < 0 ? 'rotate-180' : ''} />
            <span className="ml-1">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div className={`text-2xl font-bold mb-1 ${
        theme.mode === 'geek' ? 'text-geek-text font-mono' : 'text-minimal-text'
      }`}>
        {value}
      </div>
      
      <div className={`text-sm ${
        theme.mode === 'geek' ? 'text-geek-muted font-mono' : 'text-minimal-muted'
      }`}>
        {title}
      </div>
    </div>
  );
};

const StatsPanel: React.FC = () => {
  const { currentView, getWeekStats, getMonthStats, events, theme } = useCalendarStore();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    avgProductivity: 0,
    completionRate: 0
  });

  useEffect(() => {
    let currentStats;
    if (currentView.type === 'week') {
      currentStats = getWeekStats();
    } else {
      currentStats = getMonthStats();
    }

    const completionRate = currentStats.total > 0 
      ? Math.round((currentStats.completed / currentStats.total) * 100) 
      : 0;

    setStats({
      ...currentStats,
      completionRate,
      avgProductivity: Math.round(currentStats.avgProductivity * 100) / 100
    });
  }, [currentView, events, getWeekStats, getMonthStats]);

  const getColorClass = (type: string) => {
    const baseColors = theme.mode === 'geek' ? {
      blue: 'bg-blue-900/30 text-geek-secondary',
      green: 'bg-green-900/30 text-geek-primary', 
      purple: 'bg-purple-900/30 text-purple-400',
      orange: 'bg-orange-900/30 text-orange-400'
    } : {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600', 
      orange: 'bg-orange-100 text-orange-600'
    };
    
    return baseColors[type as keyof typeof baseColors] || baseColors.blue;
  };

  return (
    <div className="space-y-4">
      <div className={`
        flex items-center gap-2 mb-4
        ${theme.mode === 'geek' ? 'text-geek-primary' : 'text-minimal-primary'}
      `}>
        <BarChart3 size={20} />
        <h3 className={`text-lg font-bold ${theme.mode === 'geek' ? 'font-mono' : ''}`}>
          {currentView.type === 'week' ? '本周' : '本月'}统计
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="总事件数"
          value={stats.total}
          icon={<Clock size={20} />}
          color={getColorClass('blue')}
        />
        
        <StatCard
          title="已完成"
          value={stats.completed}
          icon={<Target size={20} />}
          color={getColorClass('green')}
          trend={stats.completionRate > 70 ? 15 : -5}
        />
        
        <StatCard
          title="完成率"
          value={`${stats.completionRate}%`}
          icon={<TrendingUp size={20} />}
          color={getColorClass('purple')}
        />
        
        <StatCard
          title="平均效率"
          value={stats.avgProductivity.toFixed(1)}
          icon={<BarChart3 size={20} />}
          color={getColorClass('orange')}
        />
      </div>

      {/* 快速洞察 */}
      <div className={`
        p-4 rounded-lg border
        ${theme.mode === 'geek' 
          ? 'bg-geek-surface/50 border-geek-primary/10' 
          : 'bg-minimal-surface/50 border-minimal-secondary/10'
        }
      `}>
        <h4 className={`
          text-sm font-medium mb-2
          ${theme.mode === 'geek' ? 'text-geek-primary font-mono' : 'text-minimal-primary'}
        `}>
          💡 智能洞察
        </h4>
        
        <div className={`text-sm space-y-1 ${
          theme.mode === 'geek' ? 'text-geek-text font-mono' : 'text-minimal-text'
        }`}>
          {stats.completionRate >= 80 && (
            <div className="text-green-500">🎯 完成率优秀！保持这个势头</div>
          )}
          {stats.completionRate < 50 && (
            <div className="text-orange-500">⚠️ 完成率偏低，建议优化时间规划</div>
          )}
          {stats.avgProductivity > 0.8 && (
            <div className="text-blue-500">🚀 效率很高！当前工作节奏很棒</div>
          )}
          {stats.total === 0 && (
            <div className="text-gray-500">📝 还没有数据，开始记录你的日程吧</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;