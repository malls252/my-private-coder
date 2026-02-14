import { useState, useEffect, useCallback } from "react";
import { BodyProgress, WeightEntry, PhotoEntry, BodyGoal } from "@/types/bodyProgress";

const STORAGE_KEY = "bulking-body-progress";

const defaultProgress: BodyProgress = {
  weights: [],
  photos: [],
  goal: null,
};

export function useBodyProgress() {
  const [progress, setProgress] = useState<BodyProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProgress({
          ...defaultProgress,
          ...parsed,
        });
      }
    } catch (error) {
      console.error("Error loading body progress:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever progress changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (error) {
        console.error("Error saving body progress:", error);
      }
    }
  }, [progress, isLoaded]);

  const addWeight = useCallback((entry: WeightEntry) => {
    setProgress((prev) => {
      // Remove existing entry for same date
      const filtered = prev.weights.filter((w) => w.date !== entry.date);
      return {
        ...prev,
        weights: [...filtered, entry].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
      };
    });
  }, []);

  const addPhoto = useCallback((entry: PhotoEntry) => {
    setProgress((prev) => {
      // Remove existing entry for same date
      const filtered = prev.photos.filter((p) => p.date !== entry.date);
      return {
        ...prev,
        photos: [...filtered, entry].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
      };
    });
  }, []);

  const setGoal = useCallback((goal: BodyGoal) => {
    setProgress((prev) => ({
      ...prev,
      goal,
    }));
  }, []);

  const deleteWeight = useCallback((date: string) => {
    setProgress((prev) => ({
      ...prev,
      weights: prev.weights.filter((w) => w.date !== date),
    }));
  }, []);

  const deletePhoto = useCallback((date: string) => {
    setProgress((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.date !== date),
    }));
  }, []);

  const getLatestWeight = useCallback(() => {
    const weights = progress.weights;
    return weights.length > 0 ? weights[weights.length - 1] : null;
  }, [progress.weights]);

  const getWeightChange = useCallback(() => {
    const weights = progress.weights;
    if (weights.length < 2) return 0;
    const first = weights[0].weight;
    const last = weights[weights.length - 1].weight;
    return last - first;
  }, [progress.weights]);

  return {
    progress,
    isLoaded,
    addWeight,
    addPhoto,
    setGoal,
    deleteWeight,
    deletePhoto,
    getLatestWeight,
    getWeightChange,
  };
}
