export interface CalendarEvent {
  id?: number;
  date: string;
  title: string;
  category?: string;
  
  // 时间段
  morning_7_8?: string;
  morning_8_9?: string;
  morning_9_10?: string;
  morning_10_11?: string;
  morning_11_12?: string;
  
  afternoon_12_13?: string;
  afternoon_13_14?: string;
  afternoon_14_15?: string;
  afternoon_15_16?: string;
  afternoon_16_17?: string;
  afternoon_17_18?: string;
  
  evening_18_19?: string;
  evening_19_20?: string;
  evening_20_21?: string;
  evening_21_22?: string;
  evening_22_23?: string;
  evening_23_24?: string;
  
  // 完成状态
  morning_completed?: boolean;
  afternoon_completed?: boolean;
  evening_completed?: boolean;
  
  productivity_score?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ViewMode {
  type: 'day' | 'week' | 'month' | 'year';
  date: Date;
}

export interface Theme {
  mode: 'geek' | 'minimal';
}

export interface TimeSlot {
  key: string;
  label: string;
  period: 'morning' | 'afternoon' | 'evening';
}

export const TIME_SLOTS: TimeSlot[] = [
  { key: 'morning_7_8', label: '7:00-8:00', period: 'morning' },
  { key: 'morning_8_9', label: '8:00-9:00', period: 'morning' },
  { key: 'morning_9_10', label: '9:00-10:00', period: 'morning' },
  { key: 'morning_10_11', label: '10:00-11:00', period: 'morning' },
  { key: 'morning_11_12', label: '11:00-12:00', period: 'morning' },
  
  { key: 'afternoon_12_13', label: '12:00-13:00', period: 'afternoon' },
  { key: 'afternoon_13_14', label: '13:00-14:00', period: 'afternoon' },
  { key: 'afternoon_14_15', label: '14:00-15:00', period: 'afternoon' },
  { key: 'afternoon_15_16', label: '15:00-16:00', period: 'afternoon' },
  { key: 'afternoon_16_17', label: '16:00-17:00', period: 'afternoon' },
  { key: 'afternoon_17_18', label: '17:00-18:00', period: 'afternoon' },
  
  { key: 'evening_18_19', label: '18:00-19:00', period: 'evening' },
  { key: 'evening_19_20', label: '19:00-20:00', period: 'evening' },
  { key: 'evening_20_21', label: '20:00-21:00', period: 'evening' },
  { key: 'evening_21_22', label: '21:00-22:00', period: 'evening' },
  { key: 'evening_22_23', label: '22:00-23:00', period: 'evening' },
  { key: 'evening_23_24', label: '23:00-24:00', period: 'evening' }
];