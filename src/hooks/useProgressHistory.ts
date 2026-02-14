import { useState, useEffect, useCallback } from "react";
import { DailyProgress } from "@/types/progress";

const STORAGE_KEY = "bulking-progress-history";
const MAX_DAYS = 60;

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadHistory(): DailyProgress[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

function saveHistory(history: DailyProgress[]) {
  const trimmed = history.slice(-MAX_DAYS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function useProgressHistory() {
  const [history, setHistory] = useState<DailyProgress[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addProgress = useCallback(
    (entry: Omit<DailyProgress, "progressPercent">) => {
      const progressPercent =
        entry.totalCalories > 0
          ? Math.round((entry.completedCalories / entry.totalCalories) * 100)
          : 0;

      const newEntry: DailyProgress = {
        ...entry,
        progressPercent,
      };

      setHistory((prev) => {
        const withoutToday = prev.filter((e) => e.date !== newEntry.date);
        const updated = [...withoutToday, newEntry].sort(
          (a, b) => a.date.localeCompare(b.date)
        );
        saveHistory(updated);
        return updated;
      });
    },
    []
  );

  const getLast7Days = useCallback(() => {
    const today = getToday();
    const historyByDate = new Map(history.map((h) => [h.date, h]));
    const result: DailyProgress[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const entry = historyByDate.get(dateStr) ?? {
        date: dateStr,
        completedCalories: 0,
        totalCalories: 0,
        completedMeals: 0,
        totalMeals: 0,
        progressPercent: 0,
      };
      result.push(entry);
    }
    return result;
  }, [history]);

  const getStreak = useCallback(
    (todayProgressPercent?: number) => {
      const today = getToday();
      const historyByDate = new Map(history.map((h) => [h.date, h]));
      let streak = 0;

      for (let i = 0; i < 365; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        const isToday = dateStr === today;
        const progress = isToday
          ? todayProgressPercent
          : historyByDate.get(dateStr)?.progressPercent;

        if (progress === undefined || progress < 80) break;
        streak++;
      }
      return streak;
    },
    [history]
  );

  const getWeeklyStats = useCallback(() => {
    const last7 = history.filter((h) => {
      const d = new Date(h.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return d >= weekAgo;
    });

    if (last7.length === 0) {
      return { avgCalories: 0, totalDays: 0, bestDay: null };
    }

    const totalCal = last7.reduce((s, h) => s + h.completedCalories, 0);
    const avgCalories = Math.round(totalCal / last7.length);
    const bestDay = last7.reduce((best, curr) =>
      curr.completedCalories > (best?.completedCalories ?? 0) ? curr : best
    );

    return {
      avgCalories,
      totalDays: last7.length,
      bestDay: bestDay || null,
    };
  }, [history]);

  return {
    history,
    addProgress,
    getLast7Days,
    getStreak,
    getWeeklyStats,
  };
}
