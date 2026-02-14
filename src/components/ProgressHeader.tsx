import { useMemo } from "react";
import { MealSchedule } from "@/types/meal";
import { Flame, Target, TrendingUp, LogOut, BarChart3 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProgressHeaderProps {
  meals: MealSchedule[];
  totalCalories: number;
  completedCalories: number;
  onViewProgress?: () => void;
}

export function ProgressHeader({
  meals,
  totalCalories,
  completedCalories,
  onViewProgress,
}: ProgressHeaderProps) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Berhasil keluar");
  };

  const completedCount = useMemo(
    () => meals.filter((m) => m.isCompleted).length,
    [meals]
  );

  const progressPercent = useMemo(
    () => (totalCalories > 0 ? (completedCalories / totalCalories) * 100 : 0),
    [completedCalories, totalCalories]
  );

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground truncate">
            Jadwal Bulking 💪
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">

          {onViewProgress && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={onViewProgress}
              aria-label="Lihat progress"
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          )}
          <div className="flex items-center gap-1 bg-accent/10 text-accent px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="font-bold text-xs sm:text-sm">{totalCalories}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        <div className="bg-secondary rounded-xl p-2 sm:p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-primary mb-1">
            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-foreground">{meals.length}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Jadwal</p>
        </div>
        <div className="bg-secondary rounded-xl p-2 sm:p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-primary mb-1">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-foreground">{completedCount}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Selesai</p>
        </div>
        <div className="bg-secondary rounded-xl p-2 sm:p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-accent mb-1">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-foreground">{completedCalories}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Kalori</p>
        </div>
      </div>


      <div className="relative">
        <div className="h-2.5 sm:h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-center text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2">
          {progressPercent.toFixed(0)}% target harian tercapai
        </p>
      </div>

    </div>
  );
}
