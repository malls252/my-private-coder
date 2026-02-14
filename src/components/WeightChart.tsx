import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { WeightEntry } from "@/types/bodyProgress";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

interface WeightChartProps {
  data: WeightEntry[];
  targetWeight?: number;
  height?: number;
}

export function WeightChart({ data, targetWeight, height = 250 }: WeightChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-muted-foreground">
        Belum ada data berat badan
      </div>
    );
  }

  const chartData = data.map((entry) => ({
    date: entry.date,
    weight: entry.weight,
    displayDate: format(parseISO(entry.date), "d MMM", { locale: id }),
  }));

  const minWeight = Math.min(...data.map((d) => d.weight));
  const maxWeight = Math.max(...data.map((d) => d.weight));
  const yDomain = [
    Math.floor(minWeight - 2),
    Math.ceil(maxWeight + 2),
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="displayDate"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "hsl(var(--border))" }}
        />
        <YAxis
          domain={yDomain}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "hsl(var(--border))" }}
          unit=" kg"
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const entry = data.find((d) => d.date === payload[0].payload.date);
              return (
                <div className="bg-popover border rounded-lg p-2 shadow-lg">
                  <p className="font-medium">
                    {format(parseISO(payload[0].payload.date), "d MMMM yyyy", { locale: id })}
                  </p>
                  <p className="text-primary font-bold">{payload[0].value} kg</p>
                  {entry?.notes && (
                    <p className="text-xs text-muted-foreground mt-1">{entry.notes}</p>
                  )}
                </div>
              );
            }
            return null;
          }}
        />
        {targetWeight && (
          <ReferenceLine
            y={targetWeight}
            stroke="hsl(var(--primary))"
            strokeDasharray="5 5"
            label={{
              value: `Target: ${targetWeight} kg`,
              position: "right",
              fill: "hsl(var(--primary))",
              fontSize: 12,
            }}
          />
        )}
        <Line
          type="monotone"
          dataKey="weight"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
