import { CheckCircle, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onReset: () => void;
  onOpenBodyProgress: () => void;
}

export function ActionButtons({ onReset, onOpenBodyProgress }: ActionButtonsProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-50">
      <Button
        variant="default"
        size="lg"
        className="rounded-full shadow-lg px-6 btn-primary-glow bg-primary hover:bg-primary/90"
        onClick={onReset}
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Selesaikan untuk Hari Ini
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="rounded-full shadow-lg px-6"
        onClick={onOpenBodyProgress}
      >
        <TrendingUp className="w-4 h-4 mr-2" />
        Body Progress
      </Button>
    </div>
  );
}
