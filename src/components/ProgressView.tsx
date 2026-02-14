import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { DailyProgress } from "@/types/progress";
import { BodyProgress } from "@/types/bodyProgress";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Trophy, TrendingUp, Scale, Ruler, Camera, Target } from "lucide-react";
import { WeightChart } from "./WeightChart";

import { PhotoGallery } from "./PhotoGallery";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";


interface ProgressViewProps {
  last7Days: DailyProgress[];
  todayLive: {
    completedCalories: number;
    totalCalories: number;
    progressPercent: number;
    completedMeals: number;
    totalMeals: number;
  };
  streak: number;
  weeklyStats: {
    avgCalories: number;
    totalDays: number;
    bestDay: DailyProgress | null;
  };
  bodyProgress?: BodyProgress;
  onDeleteWeight?: (date: string) => void;

  onDeletePhoto?: (date: string) => void;
}


const chartConfig = {
  calories: {
    label: "Kalori",
    color: "hsl(var(--primary))",
  },
  progress: {
    label: "Progress %",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("id-ID", { weekday: "short" });
}

export function ProgressView({
  last7Days,
  todayLive,
  streak,
  weeklyStats,
  bodyProgress,
  onDeleteWeight,

  onDeletePhoto,
}: ProgressViewProps) {
  const [activeTab, setActiveTab] = useState("meals");

  const today = new Date().toISOString().slice(0, 10);
  const chartData = useMemo(() => {
    return last7Days.map((day) => {
      const isToday = day.date === today;
      return {
        date: formatShortDate(day.date),
        fullDate: day.date,
        calories: isToday ? todayLive.completedCalories : day.completedCalories,
        progress: isToday ? todayLive.progressPercent : day.progressPercent,
      };
    });
  }, [last7Days, today, todayLive]);

  const latestWeight = bodyProgress?.weights[bodyProgress.weights.length - 1];
  const firstWeight = bodyProgress?.weights[0];
  const weightChange = latestWeight && firstWeight 
    ? latestWeight.weight - firstWeight.weight 
    : 0;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="meals">Progress Makan</TabsTrigger>
        <TabsTrigger value="body">Body Progress</TabsTrigger>
      </TabsList>

      <TabsContent value="meals" className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">

        <div className="bg-secondary rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <Flame className="w-5 h-5 text-accent" />
          </div>
          <p className="text-2xl font-bold text-foreground">{streak}</p>
          <p className="text-xs text-muted-foreground">Hari Streak</p>
        </div>
        <div className="bg-secondary rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {weeklyStats.avgCalories}
          </p>
          <p className="text-xs text-muted-foreground">Rata-rata/minggu</p>
        </div>
        <div className="bg-secondary rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <Trophy className="w-5 h-5 text-accent" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {weeklyStats.bestDay?.completedCalories ?? "-"}
          </p>
          <p className="text-xs text-muted-foreground">Terbaik</p>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card rounded-2xl p-4">
        <h3 className="font-semibold text-foreground mb-4">
          Kalori 7 Hari Terakhir
        </h3>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={chartData} margin={{ top: 8, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => `${v}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="calories"
              fill="var(--color-calories)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Tekan "Selesaikan untuk Hari Ini" untuk menyimpan progress hari ini ke riwayat
        </p>
      </div>
      </TabsContent>

      <TabsContent value="body" className="space-y-6">
        {/* Weight Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {latestWeight ? latestWeight.weight.toFixed(1) : "-"}
            </p>
            <p className="text-xs text-muted-foreground">Berat Terakhir (kg)</p>
          </div>
          <div className="bg-secondary rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <p className={`text-2xl font-bold ${weightChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {weightChange > 0 ? "+" : ""}{weightChange.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">Perubahan (kg)</p>
          </div>
        </div>

        {/* Weight Chart */}
        <div className="glass-card rounded-2xl p-4">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Scale className="w-4 h-4" />
            Grafik Berat Badan
          </h3>
          <WeightChart 
            data={bodyProgress?.weights || []} 
            targetWeight={bodyProgress?.goal?.targetWeight}
          />
        </div>



        {/* Photo Gallery */}
        <div className="glass-card rounded-2xl p-4">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Foto Progress
          </h3>
          <PhotoGallery 
            photos={bodyProgress?.photos || []} 
            onDelete={onDeletePhoto}
          />
        </div>

        {/* Goal Info */}
        {bodyProgress?.goal && (
          <div className="bg-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Goal Bulking</h3>
            </div>
            <div className="space-y-1 text-sm">
              <p>Target: {bodyProgress.goal.startWeight} kg → {bodyProgress.goal.targetWeight} kg</p>
              <p>Deadline: {format(parseISO(bodyProgress.goal.targetDate), "d MMMM yyyy", { locale: id })}</p>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ 
                    width: `${Math.min(100, Math.max(0, 
                      ((latestWeight?.weight || bodyProgress.goal.startWeight) - bodyProgress.goal.startWeight) / 
                      (bodyProgress.goal.targetWeight - bodyProgress.goal.startWeight) * 100
                    ))}%` 
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
