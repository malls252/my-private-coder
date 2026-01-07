import { RotateCcw, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onReset: () => void;
  onTestAlarm: () => void;
}

export function ActionButtons({ onReset, onTestAlarm }: ActionButtonsProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-50">
      <Button
        variant="secondary"
        size="lg"
        className="rounded-full shadow-lg px-6"
        onClick={onReset}
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset Hari Ini
      </Button>
      <Button
        variant="default"
        size="lg"
        className="rounded-full shadow-lg px-6 btn-primary-glow bg-primary hover:bg-primary/90"
        onClick={onTestAlarm}
      >
        <Bell className="w-4 h-4 mr-2" />
        Test Alarm
      </Button>
    </div>
  );
}
