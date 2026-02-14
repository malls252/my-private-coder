import { useEffect, useState, useCallback } from "react";

declare global {
  interface Window {
    OneSignal?: any;
    OneSignalDeferred?: any[];
  }
}

interface OneSignalUser {
  onesignalId?: string;
  externalId?: string;
  subscriptionId?: string;
}

export function useOneSignal() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [user, setUser] = useState<OneSignalUser | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  // Check if OneSignal is available
  const getOneSignal = useCallback(() => {
    return window.OneSignal;
  }, []);

  // Initialize and check subscription status
  useEffect(() => {
    const checkOneSignal = async () => {
      const OneSignal = getOneSignal();
      if (!OneSignal) {
        console.log("OneSignal not loaded yet");
        return;
      }

      try {
        // Check if initialized
        const initialized = await OneSignal.isPushNotificationsEnabled();
        setIsInitialized(true);

        // Check subscription status
        const subscribed = await OneSignal.isPushNotificationsEnabled();
        setIsSubscribed(subscribed);

        // Get permission state
        const perm = await OneSignal.getNotificationPermission();
        setPermission(perm);

        // Get user info if subscribed
        if (subscribed) {
          const onesignalId = await OneSignal.getOneSignalId();
          const subscriptionId = await OneSignal.getSubscriptionId();
          setUser({
            onesignalId,
            subscriptionId,
          });
        }

        console.log("OneSignal initialized:", { initialized, subscribed, perm });
      } catch (error) {
        console.error("OneSignal initialization error:", error);
      }
    };

    // Check immediately and after a delay to ensure OneSignal is loaded
    checkOneSignal();
    const timeout = setTimeout(checkOneSignal, 2000);
    const interval = setInterval(checkOneSignal, 5000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [getOneSignal]);

  // Request push notification permission
  const requestPermission = useCallback(async () => {
    const OneSignal = getOneSignal();
    if (!OneSignal) {
      console.error("OneSignal not available");
      return false;
    }

    try {
      await OneSignal.showNativePrompt();
      const subscribed = await OneSignal.isPushNotificationsEnabled();
      setIsSubscribed(subscribed);
      return subscribed;
    } catch (error) {
      console.error("Error requesting permission:", error);
      return false;
    }
  }, [getOneSignal]);

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    const OneSignal = getOneSignal();
    if (!OneSignal) return false;

    try {
      await OneSignal.registerForPushNotifications();
      const subscribed = await OneSignal.isPushNotificationsEnabled();
      setIsSubscribed(subscribed);
      return subscribed;
    } catch (error) {
      console.error("Error subscribing:", error);
      return false;
    }
  }, [getOneSignal]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    const OneSignal = getOneSignal();
    if (!OneSignal) return false;

    try {
      await OneSignal.setSubscription(false);
      setIsSubscribed(false);
      return true;
    } catch (error) {
      console.error("Error unsubscribing:", error);
      return false;
    }
  }, [getOneSignal]);

  // Set external user ID (for identifying user across devices)
  const setExternalUserId = useCallback(async (externalId: string) => {
    const OneSignal = getOneSignal();
    if (!OneSignal) return false;

    try {
      await OneSignal.setExternalUserId(externalId);
      setUser((prev) => ({ ...prev, externalId }));
      return true;
    } catch (error) {
      console.error("Error setting external user ID:", error);
      return false;
    }
  }, [getOneSignal]);

  // Remove external user ID
  const removeExternalUserId = useCallback(async () => {
    const OneSignal = getOneSignal();
    if (!OneSignal) return false;

    try {
      await OneSignal.removeExternalUserId();
      setUser((prev) => ({ ...prev, externalId: undefined }));
      return true;
    } catch (error) {
      console.error("Error removing external user ID:", error);
      return false;
    }
  }, [getOneSignal]);

  // Send tag (for segmentation)
  const sendTag = useCallback(async (key: string, value: string) => {
    const OneSignal = getOneSignal();
    if (!OneSignal) return false;

    try {
      await OneSignal.sendTag(key, value);
      return true;
    } catch (error) {
      console.error("Error sending tag:", error);
      return false;
    }
  }, [getOneSignal]);

  // Send multiple tags
  const sendTags = useCallback(async (tags: Record<string, string>) => {
    const OneSignal = getOneSignal();
    if (!OneSignal) return false;

    try {
      await OneSignal.sendTags(tags);
      return true;
    } catch (error) {
      console.error("Error sending tags:", error);
      return false;
    }
  }, [getOneSignal]);

  // Get tags
  const getTags = useCallback(async () => {
    const OneSignal = getOneSignal();
    if (!OneSignal) return null;

    try {
      const tags = await OneSignal.getTags();
      return tags;
    } catch (error) {
      console.error("Error getting tags:", error);
      return null;
    }
  }, [getOneSignal]);

  // Delete tag
  const deleteTag = useCallback(async (key: string) => {
    const OneSignal = getOneSignal();
    if (!OneSignal) return false;

    try {
      await OneSignal.deleteTag(key);
      return true;
    } catch (error) {
      console.error("Error deleting tag:", error);
      return false;
    }
  }, [getOneSignal]);

  // Add event listener for subscription change
  useEffect(() => {
    const OneSignal = getOneSignal();
    if (!OneSignal) return;

    const handleSubscriptionChange = (isSubscribed: boolean) => {
      console.log("OneSignal subscription changed:", isSubscribed);
      setIsSubscribed(isSubscribed);
    };

    OneSignal.on("subscriptionChange", handleSubscriptionChange);

    return () => {
      // Cleanup if needed
    };
  }, [getOneSignal]);

  return {
    isInitialized,
    isSubscribed,
    user,
    permission,
    requestPermission,
    subscribe,
    unsubscribe,
    setExternalUserId,
    removeExternalUserId,
    sendTag,
    sendTags,
    getTags,
    deleteTag,
    OneSignal: getOneSignal,
  };
}
