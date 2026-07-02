import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimerState {
  activeTaskId: string | null;
  activeTaskTitle: string | null;
  isRunning: boolean;
  startTime: number | null; // Timestamp
  elapsedSeconds: number;
  startTimer: (taskId: string, taskTitle: string) => void;
  stopTimer: () => { elapsedHours: number; taskId: string } | null;
  tick: () => void;
  resetTimer: () => void;
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  createdAt: string;
  read: boolean;
}

interface UIState {
  notifications: Notification[];
  addNotification: (message: string, type?: 'info' | 'success' | 'warning') => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      activeTaskId: null,
      activeTaskTitle: null,
      isRunning: false,
      startTime: null,
      elapsedSeconds: 0,

      startTimer: (taskId, taskTitle) => {
        set({
          activeTaskId: taskId,
          activeTaskTitle: taskTitle,
          isRunning: true,
          startTime: Date.now(),
          elapsedSeconds: 0,
        });
      },

      stopTimer: () => {
        const { activeTaskId, startTime, elapsedSeconds, isRunning } = get();
        if (!isRunning || !activeTaskId || !startTime) return null;

        const totalSeconds = elapsedSeconds + Math.floor((Date.now() - startTime) / 1000);
        const elapsedHours = parseFloat((totalSeconds / 3600).toFixed(2));

        set({
          isRunning: false,
          activeTaskId: null,
          activeTaskTitle: null,
          startTime: null,
          elapsedSeconds: 0,
        });

        return { elapsedHours, taskId: activeTaskId };
      },

      tick: () => {
        const { isRunning, startTime, elapsedSeconds } = get();
        if (!isRunning || !startTime) return;
        
        // Calculate dynamic elapsed time relative to start time to maintain accuracy
        const secondsSinceStart = Math.floor((Date.now() - startTime) / 1000);
        set({ elapsedSeconds: secondsSinceStart });
      },

      resetTimer: () => {
        set({
          activeTaskId: null,
          activeTaskTitle: null,
          isRunning: false,
          startTime: null,
          elapsedSeconds: 0,
        });
      },
    }),
    {
      name: 'timiclassic-timer-store',
    }
  )
);

export const useUIStore = create<UIState>((set) => ({
  notifications: [
    {
      id: 'welcome',
      message: 'Welcome to Timiclassic Command Center!',
      type: 'info',
      createdAt: new Date().toISOString(),
      read: false,
    },
  ],
  addNotification: (message, type = 'info') => {
    set((state) => ({
      notifications: [
        {
          id: Math.random().toString(36).substring(7),
          message,
          type,
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...state.notifications,
      ],
    }));
  },
  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },
  clearNotifications: () => {
    set({ notifications: [] });
  },
}));
