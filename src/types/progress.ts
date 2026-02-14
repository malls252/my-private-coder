export interface DailyProgress {
  date: string; // YYYY-MM-DD
  completedCalories: number;
  totalCalories: number;
  completedMeals: number;
  totalMeals: number;
  progressPercent: number;
}
