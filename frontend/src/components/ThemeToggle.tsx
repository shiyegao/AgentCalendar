import React from 'react';
import { Monitor, Zap } from 'lucide-react';
import { useCalendarStore } from '../stores/calendarStore';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useCalendarStore();

  const toggleTheme = () => {
    setTheme({
      mode: theme.mode === 'geek' ? 'minimal' : 'geek'
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm
        ${theme.mode === 'geek' 
          ? 'bg-geek-surface text-geek-primary border border-geek-primary/30 hover:bg-geek-primary/10' 
          : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
        } shadow-sm hover:shadow-md
      `}
    >
      {theme.mode === 'geek' ? (
        <>
          <Monitor size={16} />
          <span className="font-mono text-sm">极客风</span>
        </>
      ) : (
        <>
          <Zap size={16} />
          <span className="text-sm">极简风</span>
        </>
      )}
      
      {/* 切换动画指示器 */}
      <div className={`
        w-8 h-4 rounded-full transition-all duration-300 relative
        ${theme.mode === 'geek' ? 'bg-geek-primary/20' : 'bg-minimal-primary/20'}
      `}>
        <div className={`
          absolute top-0.5 w-3 h-3 rounded-full transition-all duration-300
          ${theme.mode === 'geek' 
            ? 'right-0.5 bg-geek-primary shadow-geek-primary/50' 
            : 'left-0.5 bg-minimal-primary shadow-minimal-primary/50'
          } shadow-lg
        `} />
      </div>
    </button>
  );
};

export default ThemeToggle;