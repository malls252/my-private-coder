import { useMealSchedule } from "@/hooks/useMealSchedule";
import { useAlarm } from "@/hooks/useAlarm";
import { MealCard } from "@/components/MealCard";
import { ProgressHeader } from "@/components/ProgressHeader";
import { ActionButtons } from "@/components/ActionButtons";
import { toast } from "sonner";

const Index = () => {
  const {
    meals,
    isLoaded,
    toggleComplete,
    toggleAlarm,
    resetDaily,
    getTotalCalories,
    getCompletedCalories,
  } = useMealSchedule();

  useAlarm(meals);

  const handleTestAlarm = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          toast.success("🔔 Alarm aktif!", {
            description: "Kamu akan menerima notifikasi saat waktu makan tiba",
          });
          
          new Notification("Test Alarm Bulking 💪", {
            body: "Notifikasi berfungsi dengan baik!",
            icon: "/favicon.ico",
          });
        } else {
          toast.error("Izinkan notifikasi untuk mengaktifkan alarm", {
            description: "Buka pengaturan browser untuk mengizinkan notifikasi",
          });
        }
      });
    }
  };

  const handleReset = () => {
    resetDaily();
    toast.success("✨ Jadwal direset", {
      description: "Semua jadwal makan kembali ke awal",
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse-slow text-4xl">💪</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        <ProgressHeader
          meals={meals}
          totalCalories={getTotalCalories()}
          completedCalories={getCompletedCalories()}
        />

        <div className="space-y-4">
          {meals.map((meal, index) => (
            <MealCard
              key={meal.id}
              meal={meal}
              index={index}
              onToggleComplete={toggleComplete}
              onToggleAlarm={toggleAlarm}
            />
          ))}
        </div>
      </div>

      <ActionButtons onReset={handleReset} onTestAlarm={handleTestAlarm} />
    </main>
  );
};

export default Index;
