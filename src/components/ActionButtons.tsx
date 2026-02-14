import { CheckCircle, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onReset: () => void;
  onOpenBodyProgress: () => void;
}

export function ActionButtons({ onReset, onOpenBodyProgress }: ActionButtonsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 bg-background/80 backdrop-blur-lg border-t border-border/50 safe-area-pb">
        <Button
          variant="default"
          size="sm"
          className="rounded-full shadow-lg px-3 sm:px-6 py-2 h-auto sm:h-10 btn-primary-glow bg-primary hover:bg-primary/90 text-xs sm:text-sm touch-manipulation whitespace-nowrap"
          onClick={onReset}
        >
          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
          <span className="hidden xs:inline">Selesaikan untuk Hari Ini</span>
          <span className="xs:hidden">Selesaikan</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full shadow-lg px-3 sm:px-6 py-2 h-auto sm:h-10 text-xs sm:text-sm touch-manipulation whitespace-nowrap"
          onClick={onOpenBodyProgress}
        >
          <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
          Body Progress
        </Button>
      </div>
    </div>
  );
}
