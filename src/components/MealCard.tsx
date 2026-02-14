import { MealSchedule } from "@/types/meal";
import { Check, Bell, BellOff, Clock, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface MealCardProps {
  meal: MealSchedule;
  onToggleComplete: (id: string) => void;
  onToggleAlarm: (id: string) => void;
  onEdit: (meal: MealSchedule) => void;
  index: number;
}

export function MealCard({
  meal,
  onToggleComplete,
  onToggleAlarm,
  onEdit,
  index,
}: MealCardProps) {
  const totalCalories = meal.items.reduce(
    (sum, item) => sum + (item.calories || 0),
    0
  );

  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-3 sm:p-4 transition-all duration-300 animate-slide-up",
        meal.isCompleted && "opacity-60"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >

      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <span className="text-2xl sm:text-3xl flex-shrink-0">{meal.icon}</span>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base sm:text-lg text-foreground truncate">{meal.title}</h3>
            <div className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{meal.time}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">

          <button
            onClick={() => onEdit(meal)}
            className="p-1.5 sm:p-2 rounded-full transition-all bg-muted text-muted-foreground hover:bg-secondary touch-manipulation"
            aria-label="Edit jadwal"
          >
            <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={() => onToggleAlarm(meal.id)}
            className={cn(
              "p-1.5 sm:p-2 rounded-full transition-all touch-manipulation",
              meal.alarmEnabled
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground"
            )}
            aria-label={meal.alarmEnabled ? "Matikan alarm" : "Nyalakan alarm"}
          >
            {meal.alarmEnabled ? (
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <BellOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>

          <button
            onClick={() => onToggleComplete(meal.id)}
            className={cn(
              "p-1.5 sm:p-2 rounded-full transition-all btn-primary-glow touch-manipulation",
              meal.isCompleted
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
            )}
            aria-label={meal.isCompleted ? "Batalkan selesai" : "Tandai selesai"}
          >
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2 mb-3">
        {meal.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between text-xs sm:text-sm py-1 sm:py-1.5 px-2 sm:px-3 bg-secondary/50 rounded-lg"
          >
            <span className={cn("truncate mr-2", meal.isCompleted && "line-through")}>
              {item.name}
            </span>
            <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground flex-shrink-0">
              <span className="hidden xs:inline">{item.portion}</span>
              {item.calories && (
                <span className="text-primary font-medium whitespace-nowrap">
                  {item.calories} kal
                </span>
              )}
            </div>
          </div>
        ))}
      </div>


      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs sm:text-sm text-muted-foreground">Total Kalori</span>
        <span className="font-bold text-primary text-sm sm:text-base">{totalCalories} kal</span>
      </div>

    </div>
  );
}
