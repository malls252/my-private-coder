import { useState } from "react";
import { MealSchedule, MealItem } from "@/types/meal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface EditMealDialogProps {
  meal: MealSchedule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (meal: MealSchedule) => void;
}

export function EditMealDialog({
  meal,
  open,
  onOpenChange,
  onSave,
}: EditMealDialogProps) {
  const [editedMeal, setEditedMeal] = useState<MealSchedule | null>(null);

  // Sync state when meal changes
  useState(() => {
    if (meal) {
      setEditedMeal({ ...meal, items: [...meal.items] });
    }
  });

  // Update editedMeal when dialog opens with new meal
  if (meal && (!editedMeal || editedMeal.id !== meal.id)) {
    setEditedMeal({ ...meal, items: meal.items.map((item) => ({ ...item })) });
  }

  if (!editedMeal) return null;

  const handleTitleChange = (value: string) => {
    setEditedMeal({ ...editedMeal, title: value.slice(0, 50) });
  };

  const handleTimeChange = (value: string) => {
    setEditedMeal({ ...editedMeal, time: value });
  };

  const handleIconChange = (value: string) => {
    // Only allow emoji (limit to 2 chars for emoji support)
    setEditedMeal({ ...editedMeal, icon: value.slice(0, 2) });
  };

  const handleItemChange = (
    itemId: string,
    field: keyof MealItem,
    value: string | number
  ) => {
    setEditedMeal({
      ...editedMeal,
      items: editedMeal.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]:
                field === "calories"
                  ? Math.max(0, Math.min(9999, Number(value) || 0))
                  : String(value).slice(0, 100),
            }
          : item
      ),
    });
  };

  const handleAddItem = () => {
    const newItem: MealItem = {
      id: `${editedMeal.id}-${Date.now()}`,
      name: "",
      portion: "",
      calories: 0,
    };
    setEditedMeal({
      ...editedMeal,
      items: [...editedMeal.items, newItem],
    });
  };

  const handleRemoveItem = (itemId: string) => {
    if (editedMeal.items.length <= 1) {
      toast.error("Minimal harus ada 1 item makanan");
      return;
    }
    setEditedMeal({
      ...editedMeal,
      items: editedMeal.items.filter((item) => item.id !== itemId),
    });
  };

  const handleSave = () => {
    // Validate
    if (!editedMeal.title.trim()) {
      toast.error("Nama jadwal tidak boleh kosong");
      return;
    }
    if (!editedMeal.time) {
      toast.error("Waktu harus diisi");
      return;
    }
    if (editedMeal.items.some((item) => !item.name.trim())) {
      toast.error("Nama makanan tidak boleh kosong");
      return;
    }

    onSave(editedMeal);
    onOpenChange(false);
    toast.success("Jadwal berhasil disimpan! ✅");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{editedMeal.icon}</span>
            Edit {editedMeal.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                value={editedMeal.icon}
                onChange={(e) => handleIconChange(e.target.value)}
                className="text-center text-xl"
                maxLength={2}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="title">Nama Jadwal</Label>
              <Input
                id="title"
                value={editedMeal.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Contoh: Sarapan"
                maxLength={50}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="time">Waktu</Label>
            <Input
              id="time"
              type="time"
              value={editedMeal.time}
              onChange={(e) => handleTimeChange(e.target.value)}
            />
          </div>

          {/* Food Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Daftar Makanan</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddItem}
                className="h-8"
              >
                <Plus className="w-4 h-4 mr-1" />
                Tambah
              </Button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {editedMeal.items.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-secondary/50 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">
                      Item {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <Input
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(item.id, "name", e.target.value)
                    }
                    placeholder="Nama makanan"
                    maxLength={100}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={item.portion}
                      onChange={(e) =>
                        handleItemChange(item.id, "portion", e.target.value)
                      }
                      placeholder="Porsi (cth: 100g)"
                      maxLength={50}
                    />
                    <Input
                      type="number"
                      value={item.calories || ""}
                      onChange={(e) =>
                        handleItemChange(item.id, "calories", e.target.value)
                      }
                      placeholder="Kalori"
                      min={0}
                      max={9999}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
