import { useEffect, useCallback, useRef } from "react";
import { MealSchedule } from "@/types/meal";
import { toast } from "sonner";

export function useAlarm(meals: MealSchedule[]) {
  const notifiedRef = useRef<Set<string>>(new Set());
  const lastCheckRef = useRef<number>(Date.now());

  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
    }
  }, []);

  const playSound = () => {
    try {
      // Use a slightly longer simpler beep or reuse the base64
      // Short beep for now, can be replaced with a real file in public/
      const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleR0BW6r67YVqJy2FuNDFhV0lJIa/2cuJOBMIf8DdqnoqIX2xvpuIcmRhc4mcnIBnS0BbiKeOgWtYTl2ClJB9ZlROXYKTj3xlU09ggpSQfWVUUF+ClI97ZlVQYIKTjnxmVVBfgpOOe2dVT1+Ck457aFVPX4KSjXtoVU9fgpKNe2hVT1+Cko17aFVPX4KSjXtoVU9fg5KNe2hVT16Dko17aFZPXoOSjXtoVk9eg5KNe2hWT16Dko17aFZPXoOSjXtoVU9eg5ONfGhVT12Dko18aFVPXYOSjXxpVU9dg5KNfGlUT1yDko18aVRPXIOSjHxpVE9cg5KMfGpUT1yDkox8alRPW4OSjHxqVE9bg5KMfGtUT1uDkox8a1RPW4OSjHxrU09bg5KMfGtTT1qEkox8a1NPWoSSjHxrU09ahJKMfGtTT1qEkox8a1NPWoSRi3xrU09ahJGLfGtTT1qEkYt8a1NPWoSRi3xrU09ahJGLfGtTT1qEkYt8bFNPWoSRi31sU09ahJGLfWxTT1qEkYt9bFNPWoSRi31sU09ahJGLfWxTT1qEkYt9bFNPWoSRin1sU09ahZGKfWxTT1mFkYp9bFNPWYWRin1sU09ZhZGKfWxTT1mFkYp9bFNPWYWRin1sU09ZhZGKfWxTT1mFkYp+bFNPWYWRin5sU09ZhZGKfmxTT1mFkYp+bFNPWYWQin5sU09ZhZCKfmxTT1mFkIl+bFNPWYaQiX5sU09ZhpCJfmxTT1mGkIl+bFNPWYaQiX5sU09ZhpCJfmxTT1mGkIl+bFNPWYaQiX5sU09ZhpCJfmxTT1mGkIl+bFNPWYaQiX5sU09ZhpCJfmxTT1mGkIl+bFNPWYaQiX5sU09ZhpCJfmxTT1mGkIl+bFNPWYaQiX5sU09ZhpCJfmxTT1mGkIl+bFNPWYaQiX5sU09ZhpCJfmxTT1mGkIl+bFNPWYaQiX5sU09ZhpCJfmxTT1mGkIl+bFNPWQ==");
      audio.volume = 1.0;
      audio.play().catch(e => console.error("Audio play failed", e));

      // Try to vibrate
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200]);
      }
    } catch (e) {
      console.error("Alarm sound failed", e);
    }
  };

  const showNotification = useCallback(async (meal: MealSchedule) => {
    const message = `Waktunya ${meal.title}! 🍽️`;
    const options: NotificationOptions = {
      body: `${meal.items.map((i) => i.name).join(", ")} - Jangan lupa makan!`,
      icon: "/pwa-192x192.png", // Use PWA icon
      tag: meal.id,
      requireInteraction: true, // Important for persistence on desktop
      data: { url: "/" },
      vibrate: [200, 100, 200],
    };

    // 1. Show Toast inside App
    toast(message, {
      description: options.body,
      duration: Infinity, // Keep until dismissed
      action: {
        label: "Sudah Makan",
        onClick: () => {
          // Could add auto-complete logic here if we had access to toggle function
        },
      },
    });

    // 2. Play Sound immediately
    playSound();

    // 3. System Notification (Service Worker or Classic)
    if ("serviceWorker" in navigator && navigator.serviceWorker.ready) {
      try {
        const registration = await navigator.serviceWorker.ready;
        // Service Worker notification is more reliable on Android
        await registration.showNotification(message, options);
        return;
      } catch (e) {
        console.error("SW notification failed", e);
      }
    }

    // Fallback to classic Notification API
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(message, options);
    }
  }, []);

  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      // Calculate total minutes for easy comparison
      const currentTotalMinutes = currentHours * 60 + currentMinutes;

      // Update last check time
      lastCheckRef.current = Date.now();

      meals.forEach((meal) => {
        if (!meal.alarmEnabled || meal.isCompleted) return;

        const [h, m] = meal.time.split(":").map(Number);
        const mealTotalMinutes = h * 60 + m;

        // Trigger if matches NOW 
        // OR if we missed it within the last 5 minutes (e.g. screen was off)
        // AND haven't notified yet for this instance
        const timeDiff = currentTotalMinutes - mealTotalMinutes;

        // Key concept: Ensure we notify once per day per meal
        // Format key: ID-YYYY-MM-DD
        const todayStr = now.toISOString().split('T')[0];
        const notificationKey = `${meal.id}-${todayStr}`;

        if (
          timeDiff >= 0 &&
          timeDiff <= 5 && // Window of 5 minutes after time
          !notifiedRef.current.has(notificationKey)
        ) {
          notifiedRef.current.add(notificationKey);
          showNotification(meal);
        }
      });
    };

    // Check more frequently (every 10 seconds) to catch precise minute starts
    const interval = setInterval(checkAlarms, 10000);

    // Initial check
    checkAlarms();

    return () => clearInterval(interval);
  }, [meals, showNotification]);

  // Clear old notifications daily (or just rely on the date-based key)
  // The Set acts as a session cache, but if the app reloads, it might re-notify if within window.
  // Ideally, persistent state should be used (e.g. localStorage) to prevent re-notify on reload.
  // But for now, user likely keeps app open or backgrounded.
}
