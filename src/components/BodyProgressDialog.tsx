import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Camera, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { WeightEntry, PhotoEntry, BodyGoal } from "@/types/bodyProgress";

interface BodyProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWeight: (entry: WeightEntry) => void;
  onAddPhoto: (entry: PhotoEntry) => void;
  onSetGoal: (goal: BodyGoal) => void;
  existingGoal: BodyGoal | null;
  latestWeight: number | null;
}

export function BodyProgressDialog({
  open,
  onOpenChange,
  onAddWeight,
  onAddPhoto,
  onSetGoal,
  existingGoal,
  latestWeight,
}: BodyProgressDialogProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("weight");

  // Weight form
  const [weight, setWeight] = useState("");
  const [weightNotes, setWeightNotes] = useState("");

  // Photo form
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
  const [sidePhoto, setSidePhoto] = useState<string | null>(null);
  const [backPhoto, setBackPhoto] = useState<string | null>(null);

  // Goal form
  const [targetWeight, setTargetWeight] = useState(existingGoal?.targetWeight?.toString() || "");
  const [targetDate, setTargetDate] = useState<Date | undefined>(
    existingGoal?.targetDate ? new Date(existingGoal.targetDate) : undefined
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveWeight = () => {
    if (!weight) return;
    onAddWeight({
      date: format(date, "yyyy-MM-dd"),
      weight: parseFloat(weight),
      notes: weightNotes || undefined,
    });
    resetForms();
    onOpenChange(false);
  };

  const handleSavePhoto = () => {
    if (!frontPhoto && !sidePhoto && !backPhoto) return;
    onAddPhoto({
      date: format(date, "yyyy-MM-dd"),
      front: frontPhoto || undefined,
      side: sidePhoto || undefined,
      back: backPhoto || undefined,
    });
    resetForms();
    onOpenChange(false);
  };

  const handleSaveGoal = () => {
    if (!targetWeight || !targetDate || !latestWeight) return;
    onSetGoal({
      startWeight: latestWeight,
      startDate: format(new Date(), "yyyy-MM-dd"),
      targetWeight: parseFloat(targetWeight),
      targetDate: format(targetDate, "yyyy-MM-dd"),
    });
    resetForms();
    onOpenChange(false);
  };

  const resetForms = () => {
    setWeight("");
    setWeightNotes("");
    setFrontPhoto(null);
    setSidePhoto(null);
    setBackPhoto(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Body Progress</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weight">Berat</TabsTrigger>
            <TabsTrigger value="photo">Foto</TabsTrigger>
            <TabsTrigger value="goal">Goal</TabsTrigger>
          </TabsList>

          {/* Date Picker - Common for all tabs */}
          <div className="py-4">
            <Label>Tanggal</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: id }) : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Weight Tab */}
          <TabsContent value="weight" className="space-y-4">
            <div>
              <Label htmlFor="weight">Berat Badan (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="Contoh: 70.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="weightNotes">Catatan (opsional)</Label>
              <Input
                id="weightNotes"
                placeholder="Contoh: Pagi hari, puasa"
                value={weightNotes}
                onChange={(e) => setWeightNotes(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleSaveWeight} disabled={!weight}>
                Simpan Berat
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* Photo Tab */}
          <TabsContent value="photo" className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "front", label: "Depan", value: frontPhoto, setter: setFrontPhoto },
                { key: "side", label: "Samping", value: sidePhoto, setter: setSidePhoto },
                { key: "back", label: "Belakang", value: backPhoto, setter: setBackPhoto },
              ].map(({ key, label, value, setter }) => (
                <div key={key} className="space-y-2">
                  <Label className="text-center block">{label}</Label>
                  <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden relative">
                    {value ? (
                      <>
                        <img src={value} alt={label} className="w-full h-full object-cover" />
                        <button
                          onClick={() => setter(null)}
                          className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-muted/80 transition-colors">
                        <Camera className="w-8 h-8 text-muted-foreground mb-1" />
                        <Upload className="w-4 h-4 text-muted-foreground" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(e, setter)}
                        />
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button 
                onClick={handleSavePhoto} 
                disabled={!frontPhoto && !sidePhoto && !backPhoto}
              >
                Simpan Foto
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* Goal Tab */}
          <TabsContent value="goal" className="space-y-4">
            <div>
              <Label>Berat Saat Ini</Label>
              <p className="text-2xl font-bold text-primary">
                {latestWeight ? `${latestWeight} kg` : "Belum ada data"}
              </p>
              <p className="text-xs text-muted-foreground">
                Gunakan data berat terbaru sebagai starting point
              </p>
            </div>
            <div>
              <Label htmlFor="targetWeight">Target Berat (kg)</Label>
              <Input
                id="targetWeight"
                type="number"
                step="0.1"
                placeholder="Contoh: 75"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
              />
            </div>
            <div>
              <Label>Target Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !targetDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {targetDate ? format(targetDate, "PPP", { locale: id }) : "Pilih target tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={targetDate}
                    onSelect={setTargetDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {existingGoal && (
              <div className="bg-muted p-3 rounded-lg text-sm">
                <p className="font-medium">Goal Saat Ini:</p>
                <p>Dari {existingGoal.startWeight} kg → {existingGoal.targetWeight} kg</p>
                <p>Target: {format(new Date(existingGoal.targetDate), "d MMMM yyyy", { locale: id })}</p>
              </div>
            )}
            <DialogFooter>
              <Button 
                onClick={handleSaveGoal} 
                disabled={!targetWeight || !targetDate || !latestWeight}
              >
                {existingGoal ? "Update Goal" : "Set Goal"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
