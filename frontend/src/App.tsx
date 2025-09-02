import React, { useEffect } from 'react';
import { useCalendarStore } from './stores/calendarStore';
import CalendarGrid from './components/CalendarGrid';
import ThemeToggle from './components/ThemeToggle';
import ViewModeSelector from './components/ViewModeSelector';
import DateNavigator from './components/DateNavigator';
import StatsPanel from './components/StatsPanel';
import './index.css';

const App: React.FC = () => {
  const { currentView, theme, selectedDate, error, loading } = useCalendarStore();

  useEffect(() => {
    // 根据主题模式设置根元素的类名
    if (theme.mode === 'geek') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme.mode]);

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      theme.mode === 'geek' 
        ? 'bg-geek-bg text-geek-text' 
        : 'bg-minimal-bg text-minimal-text'
    }`}>
      {/* 顶部导航栏 */}
      <header className={`
        sticky top-0 z-10 border-b backdrop-blur-sm
        ${theme.mode === 'geek' 
          ? 'bg-geek-bg/80 border-geek-primary/20' 
          : 'bg-minimal-bg/80 border-minimal-secondary/20'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* 左侧：标题 + 导航 */}
            <div className="flex items-center gap-6">
              <h1 className={`
                text-2xl font-bold
                ${theme.mode === 'geek' 
                  ? 'text-geek-primary font-mono' 
                  : 'text-minimal-primary'
                }
              `}>
                AgentCalendar
              </h1>
              
              <DateNavigator />
            </div>

            {/* 右侧：视图切换 + 主题切换 */}
            <div className="flex items-center gap-4">
              <ViewModeSelector />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* 主体内容 */}
      <main className="max-w-full mx-auto px-4 py-4">
        {/* 错误提示 */}
        {error && (
          <div className={`mb-4 p-3 rounded-lg border-l-4 ${
            theme.mode === 'geek' 
              ? 'bg-red-900/20 border-red-500 text-red-400' 
              : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            <div className="flex items-center">
              <span className="text-sm font-medium">⚠️ {error}</span>
              {error.includes('服务器') && (
                <span className="text-xs ml-2 opacity-70">
                  请运行: ./run_dev.sh 启动后端服务
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-4 h-[calc(100vh-140px)] min-h-0">
          {/* 日程表格区域 */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className={`
              rounded-lg border h-full overflow-hidden relative
              ${theme.mode === 'geek' 
                ? 'bg-geek-surface/30 border-geek-primary/20' 
                : 'bg-white border-gray-300'
              }
            `}>
              {loading && (
                <div className={`absolute inset-0 bg-opacity-50 flex items-center justify-center z-10 ${
                  theme.mode === 'geek' ? 'bg-geek-bg' : 'bg-white'
                }`}>
                  <div className={`animate-spin rounded-full h-8 w-8 border-2 ${
                    theme.mode === 'geek' 
                      ? 'border-geek-primary border-t-transparent' 
                      : 'border-blue-500 border-t-transparent'
                  }`}></div>
                </div>
              )}
              <CalendarGrid 
                viewMode={currentView.type === 'year' ? 'month' : currentView.type}
                startDate={selectedDate}
              />
            </div>
          </div>

          {/* 统计面板区域 */}
          <div className="w-72 flex-shrink-0">
            <div className={`
              rounded-lg border p-3 h-full overflow-auto
              ${theme.mode === 'geek' 
                ? 'bg-geek-surface/30 border-geek-primary/20' 
                : 'bg-white border-gray-300'
              }
            `}>
              <StatsPanel />
            </div>
          </div>
        </div>
      </main>

      {/* 底部状态栏（极客模式特有） */}
      {theme.mode === 'geek' && (
        <footer className="fixed bottom-0 left-0 right-0 bg-geek-surface/90 backdrop-blur-sm border-t border-geek-primary/20">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between text-xs font-mono text-geek-muted">
              <div className="flex items-center gap-4">
                <span>STATUS: OPERATIONAL</span>
                <span>MODE: {currentView.type.toUpperCase()}</span>
                <span>THEME: GEEK</span>
              </div>
              <div>
                <span className="text-geek-primary">█</span>
                <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;