import { useEffect, useCallback, useRef } from "react";
import { MealSchedule } from "@/types/meal";
import { toast } from "sonner";

export function useAlarm(meals: MealSchedule[]) {
  const notifiedRef = useRef<Set<string>>(new Set());

  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }, []);

  const showNotification = useCallback((meal: MealSchedule) => {
    const message = `Waktunya ${meal.title}! ${meal.icon}`;
    
    // Show toast
    toast(message, {
      description: `${meal.items.length} item makanan menunggu`,
      duration: 10000,
      action: {
        label: "Lihat",
        onClick: () => {},
      },
    });

    // Show browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(message, {
        body: `${meal.items.map((i) => i.name).join(", ")}`,
        icon: "/favicon.ico",
        tag: meal.id,
      });
    }

    // Play sound
    try {
      const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleR0BW6r67YVqJy2FuNDFhV0lJIa/2cuJOBMIf8DdqnoqIX2xvpuIcmRhc4mcnIBnS0BbiKeOgWtYTl2ClJB9ZlROXYKTj3xlU09ggpSQfWVUUF+ClI97ZlVQYIKTjnxmVVBfgpOOe2dVT1+Ck457aFVPX4KSjXtoVU9fgpKNe2hVT1+Cko17aFVPX4KSjXtoVU9fg5KNe2hVT16Dko17aFZPXoOSjXtoVk9eg5KNe2hWT16Dko17aFZPXoOSjXtoVU9eg5ONfGhVT12Dko18aFVPXYOSjXxpVU9dg5KNfGlUT1yDko18aVRPXIOSjHxpVE9cg5KMfGpUT1yDkox8alRPW4OSjHxqVE9bg5KMfGtUT1uDkox8a1RPW4OSjHxrU09bg5KMfGtTT1qEkox8a1NPWoSSjHxrU09ahJKMfGtTT1qEkox8a1NPWoSRi3xrU09ahJGLfGtTT1qEkYt8a1NPWoSRi3xrU09ahJGLfGtTT1qEkYt8bFNPWoSRi31sU09ahJGLfWxTT1qEkYt9bFNPWoSRi31sU09ahJGLfWxTT1qEkYt9bFNPWoSRin1sU09ahZGKfWxTT1mFkYp9bFNPWYWRin1sU09ZhZGKfWxTT1mFkYp9bFNPWYWRin1sU09ZhZGKfWxTT1mFkYp+bFNPWYWRin5sU09ZhZGKfmxTT1mFkYp+bFNPWYWQin5sU09ZhZCKfmxTT1mFkIl+bFNPWYaQiX5sU09ZhpCJfmxTT1mGkIl+bFNPWYaQiX5sU09ZhpCJfmxTT1mGkIl+bFNPWYaQiX5sU09ZhpCJfmxTT1mGkIl+bFNPWYaQiX5sU09ZhpCJfmxTT1mGkIl+bFNPWYaQiX5sU09ZhpCJfmxTT1mGkIl+bFNPWYaQiX5sU09ZhpCJfmxTT1mGkIl+bFNPWYaQiX5sU09ZhpCJfmxTT1mGkIl+bFNPWYaQiX5sU09ZhpCJfmxTT1mGkIl+bFNPWYaQiX5sU09ZhpCJfmxTT1mGkIl+bFNPWQ==");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {}
  }, []);

  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;

      meals.forEach((meal) => {
        const notificationKey = `${meal.id}-${currentTime}`;
        
        if (
          meal.alarmEnabled &&
          !meal.isCompleted &&
          meal.time === currentTime &&
          !notifiedRef.current.has(notificationKey)
        ) {
          notifiedRef.current.add(notificationKey);
          showNotification(meal);
        }
      });
    };

    const interval = setInterval(checkAlarms, 30000);
    checkAlarms();

    return () => clearInterval(interval);
  }, [meals, showNotification]);

  // Clear old notifications daily
  useEffect(() => {
    const clearDaily = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        notifiedRef.current.clear();
      }
    };

    const interval = setInterval(clearDaily, 60000);
    return () => clearInterval(interval);
  }, []);
}
