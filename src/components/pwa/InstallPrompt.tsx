import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener("beforeinstallprompt", handler);

        // Check if iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIosDevice);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            setDeferredPrompt(null);
            toast.success("Installation started");
        }
    };

    if (!deferredPrompt && !isIOS) return null;

    return (
        <div className="w-full mt-4">
            {deferredPrompt && (
                <Button
                    onClick={handleInstallClick}
                    variant="outline"
                    className="w-full gap-2 border-primary text-primary hover:bg-primary/10"
                >
                    <Download className="w-4 h-4" />
                    Install App
                </Button>
            )}

            {isIOS && (
                <div className="text-sm text-center text-muted-foreground mt-4 p-4 bg-muted rounded-lg">
                    <p>To install on iOS:</p>
                    <p>Tap <span className="font-bold">Share</span> and select <span className="font-bold">Add to Home Screen</span></p>
                </div>
            )}
        </div>
    );
};
