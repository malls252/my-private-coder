import { useState } from "react";
import { useMealSchedule } from "@/hooks/useMealSchedule";
import { useAlarm } from "@/hooks/useAlarm";
import { useProgressHistory } from "@/hooks/useProgressHistory";
import { useBodyProgress } from "@/hooks/useBodyProgress";
import { MealCard } from "@/components/MealCard";
import { ProgressHeader } from "@/components/ProgressHeader";
import { ProgressView } from "@/components/ProgressView";
import { ActionButtons } from "@/components/ActionButtons";
import { EditMealDialog } from "@/components/EditMealDialog";
import { BodyProgressDialog } from "@/components/BodyProgressDialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MealSchedule } from "@/types/meal";
import { toast } from "sonner";


const Index = () => {
  const {
    meals,
    isLoaded,
    toggleComplete,
    toggleAlarm,
    updateMeal,
    resetDaily,
    getTotalCalories,
    getCompletedCalories,
  } = useMealSchedule();

  const {
    addProgress,
    getLast7Days,
    getStreak,
    getWeeklyStats,
  } = useProgressHistory();

  const [editingMeal, setEditingMeal] = useState<MealSchedule | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [progressSheetOpen, setProgressSheetOpen] = useState(false);
  const [bodyProgressDialogOpen, setBodyProgressDialogOpen] = useState(false);

  const {
    progress: bodyProgress,
    addWeight,
    addPhoto,
    setGoal,
    deleteWeight,
    deletePhoto,
    getLatestWeight,
  } = useBodyProgress();

  useAlarm(meals);



  const handleEdit = (meal: MealSchedule) => {
    setEditingMeal(meal);
    setEditDialogOpen(true);
  };

  const handleSaveMeal = (updatedMeal: MealSchedule) => {
    updateMeal(updatedMeal);
  };

  const handleReset = () => {

    const total = getTotalCalories();
    const completed = getCompletedCalories();
    const completedCount = meals.filter((m) => m.isCompleted).length;
    if (total > 0 || completedCount > 0) {
      addProgress({
        date: new Date().toISOString().slice(0, 10),
        completedCalories: completed,
        totalCalories: total,
        completedMeals: completedCount,
        totalMeals: meals.length,
      });
    }
    resetDaily();
    toast.success("✨ Jadwal direset", {
      description: "Progress hari ini tersimpan. Semua jadwal makan kembali ke awal",
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
    <main className="min-h-screen bg-background pb-32 sm:pb-28">
      <div className="w-full max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">

        <ProgressHeader
          meals={meals}
          totalCalories={getTotalCalories()}
          completedCalories={getCompletedCalories()}
          onViewProgress={() => setProgressSheetOpen(true)}
        />

        <div className="space-y-4">
          {meals.map((meal, index) => (
            <MealCard
              key={meal.id}
              meal={meal}
              index={index}
              onToggleComplete={toggleComplete}
              onToggleAlarm={toggleAlarm}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>

      <ActionButtons 
        onReset={handleReset} 
        onOpenBodyProgress={() => setBodyProgressDialogOpen(true)}
      />

      <BodyProgressDialog
        open={bodyProgressDialogOpen}
        onOpenChange={setBodyProgressDialogOpen}
        onAddWeight={addWeight}
        onAddPhoto={addPhoto}
        onSetGoal={setGoal}
        existingGoal={bodyProgress.goal}
        latestWeight={getLatestWeight()?.weight || null}
      />

      <EditMealDialog

        meal={editingMeal}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveMeal}
      />

      <Sheet open={progressSheetOpen} onOpenChange={setProgressSheetOpen}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Progress Bulking 💪</SheetTitle>
          </SheetHeader>
          <div className="mt-6 overflow-y-auto pb-8">
            <ProgressView
              last7Days={getLast7Days()}
              todayLive={{
                completedCalories: getCompletedCalories(),
                totalCalories: getTotalCalories(),
                progressPercent:
                  getTotalCalories() > 0
                    ? Math.round((getCompletedCalories() / getTotalCalories()) * 100)
                    : 0,
                completedMeals: meals.filter((m) => m.isCompleted).length,
                totalMeals: meals.length,
              }}
              streak={getStreak(
                getTotalCalories() > 0
                  ? Math.round((getCompletedCalories() / getTotalCalories()) * 100)
                  : 0
              )}
              weeklyStats={getWeeklyStats()}
              bodyProgress={bodyProgress}
              onDeleteWeight={deleteWeight}
              onDeletePhoto={deletePhoto}
            />

          </div>
        </SheetContent>
      </Sheet>

    </main>

  );
};

export default Index;
