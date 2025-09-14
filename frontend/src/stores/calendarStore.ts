import { create } from 'zustand';
import { CalendarEvent, ViewMode, Theme } from '../types/calendar';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import axios from 'axios';

interface CalendarStore {
  // 状态
  events: CalendarEvent[];
  currentView: ViewMode;
  theme: Theme;
  loading: boolean;
  error: string | null;
  selectedDate: Date;
  
  // Actions
  setView: (view: ViewMode) => void;
  setTheme: (theme: Theme) => void;
  setSelectedDate: (date: Date) => void;
  
  // API 调用
  fetchEvents: (startDate?: Date, endDate?: Date) => Promise<void>;
  createEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  updateEvent: (id: number, event: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
  
  // 辅助方法
  getEventsForDate: (date: Date) => CalendarEvent[];
  getWeekStats: () => any;
  getMonthStats: () => any;
}

const API_BASE = '/api/v1';

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  // 初始状态
  events: [],
  currentView: { type: 'week', date: new Date() },
  theme: { mode: 'minimal' },
  loading: false,
  error: null,
  selectedDate: new Date(),
  
  // Actions
  setView: (view) => set({ currentView: view }),
  setTheme: (theme) => set({ theme }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  // API 调用
  fetchEvents: async (startDate, endDate) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', format(startDate, 'yyyy-MM-dd'));
      if (endDate) params.append('end_date', format(endDate, 'yyyy-MM-dd'));
      
      const response = await axios.get(`${API_BASE}/events?${params.toString()}`);
      set({ events: response.data, loading: false });
    } catch (error: any) {
      const errorMessage = error.response?.status === 404 
        ? '服务器连接失败，请检查后端服务是否启动'
        : '加载事件失败';
      set({ error: errorMessage, loading: false });
      console.error('Failed to fetch events:', error);
    }
  },
  
  createEvent: async (event) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE}/events`, event);
      const { events } = get();
      set({
        events: [...events, response.data],
        loading: false
      });
    } catch (error) {
      set({ error: '创建事件失败', loading: false });
      console.error('Failed to create event:', error);
      throw error; // 抛出错误以便组件可以处理
    }
  },
  
  updateEvent: async (id, eventUpdate) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${API_BASE}/events/${id}`, eventUpdate);
      const { events } = get();
      set({
        events: events.map(event => event.id === id ? response.data : event),
        loading: false
      });
    } catch (error) {
      set({ error: '更新事件失败', loading: false });
      console.error('Failed to update event:', error);
      throw error; // 抛出错误以便组件可以处理
    }
  },
  
  deleteEvent: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_BASE}/events/${id}`);
      const { events } = get();
      set({
        events: events.filter(event => event.id !== id),
        loading: false
      });
    } catch (error) {
      set({ error: '删除事件失败', loading: false });
      console.error('Failed to delete event:', error);
    }
  },
  
  // 辅助方法
  getEventsForDate: (date) => {
    const { events } = get();
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => 
      format(new Date(event.date), 'yyyy-MM-dd') === dateStr
    );
  },
  
  getWeekStats: () => {
    const { events, selectedDate } = get();
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    
    const weekEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= weekStart && eventDate <= weekEnd;
    });
    
    return {
      total: weekEvents.length,
      completed: weekEvents.filter(e => 
        e.morning_completed && e.afternoon_completed && e.evening_completed
      ).length,
      avgProductivity: weekEvents.reduce((sum, e) => 
        sum + (e.productivity_score || 0), 0) / weekEvents.length || 0
    };
  },
  
  getMonthStats: () => {
    const { events, selectedDate } = get();
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    
    const monthEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= monthStart && eventDate <= monthEnd;
    });
    
    return {
      total: monthEvents.length,
      completed: monthEvents.filter(e => 
        e.morning_completed && e.afternoon_completed && e.evening_completed
      ).length,
      avgProductivity: monthEvents.reduce((sum, e) => 
        sum + (e.productivity_score || 0), 0) / monthEvents.length || 0
    };
  }
}));