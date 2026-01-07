import { useState, useEffect } from "react";
import { MealSchedule } from "@/types/meal";
import { defaultMeals } from "@/data/defaultMeals";

const STORAGE_KEY = "bulking-meal-schedule";

export function useMealSchedule() {
  const [meals, setMeals] = useState<MealSchedule[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setMeals(JSON.parse(stored));
    } else {
      setMeals(defaultMeals);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
    }
  }, [meals, isLoaded]);

  const toggleComplete = (id: string) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.id === id ? { ...meal, isCompleted: !meal.isCompleted } : meal
      )
    );
  };

  const toggleAlarm = (id: string) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.id === id ? { ...meal, alarmEnabled: !meal.alarmEnabled } : meal
      )
    );
  };

  const updateMeal = (updatedMeal: MealSchedule) => {
    setMeals((prev) =>
      prev.map((meal) => (meal.id === updatedMeal.id ? updatedMeal : meal))
    );
  };

  const resetDaily = () => {
    setMeals((prev) =>
      prev.map((meal) => ({ ...meal, isCompleted: false }))
    );
  };

  const getTotalCalories = () => {
    return meals.reduce((total, meal) => {
      return (
        total +
        meal.items.reduce((sum, item) => sum + (item.calories || 0), 0)
      );
    }, 0);
  };

  const getCompletedCalories = () => {
    return meals
      .filter((meal) => meal.isCompleted)
      .reduce((total, meal) => {
        return (
          total +
          meal.items.reduce((sum, item) => sum + (item.calories || 0), 0)
        );
      }, 0);
  };

  return {
    meals,
    isLoaded,
    toggleComplete,
    toggleAlarm,
    updateMeal,
    resetDaily,
    getTotalCalories,
    getCompletedCalories,
  };
}
