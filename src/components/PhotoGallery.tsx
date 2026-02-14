import { useState } from "react";
import { PhotoEntry } from "@/types/bodyProgress";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PhotoGalleryProps {
  photos: PhotoEntry[];
  onDelete?: (date: string) => void;
}

export function PhotoGallery({ photos, onDelete }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEntry | null>(null);
  const [selectedView, setSelectedView] = useState<"front" | "side" | "back">("front");
  const [compareMode, setCompareMode] = useState(false);
  const [comparePhotos, setComparePhotos] = useState<[PhotoEntry | null, PhotoEntry | null]>([null, null]);

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground gap-2">
        <Camera className="w-12 h-12 opacity-20" />
        <p>Belum ada foto progress</p>
        <p className="text-xs">Ambil foto setiap minggu untuk melihat perubahan</p>
      </div>
    );
  }

  const sortedPhotos = [...photos].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleCompareSelect = (photo: PhotoEntry, position: 0 | 1) => {
    const newCompare = [...comparePhotos] as [PhotoEntry | null, PhotoEntry | null];
    newCompare[position] = photo;
    setComparePhotos(newCompare);
  };

  return (
    <div className="space-y-4">
      {/* Compare Mode Toggle */}
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Foto Progress</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCompareMode(!compareMode);
            setComparePhotos([null, null]);
          }}
        >
          {compareMode ? "Batal" : "Bandingkan"}
        </Button>
      </div>

      {/* Compare View */}
      {compareMode && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[0, 1].map((pos) => (
              <div key={pos} className="space-y-2">
                <p className="text-sm font-medium text-center">
                  {pos === 0 ? "Foto 1" : "Foto 2"}
                </p>
                <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden relative">
                  {comparePhotos[pos] ? (
                    <>
                      <img
                        src={comparePhotos[pos]![selectedView]}
                        alt={`Compare ${pos}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleCompareSelect(null as any, pos as 0 | 1)}
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                      Pilih foto
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Photo Selection for Compare */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sortedPhotos.map((photo) => (
              <button
                key={photo.date}
                onClick={() => handleCompareSelect(photo, comparePhotos[0] ? 1 : 0)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  comparePhotos.some(p => p?.date === photo.date) 
                    ? "border-primary" 
                    : "border-transparent"
                }`}
              >
                <img
                  src={photo.front}
                  alt={format(parseISO(photo.date), "d MMM")}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {!compareMode && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sortedPhotos.map((photo) => (
            <button
              key={photo.date}
              onClick={() => setSelectedPhoto(photo)}
              className="aspect-[3/4] bg-muted rounded-lg overflow-hidden relative group"
            >
              <img
                src={photo.front || photo.side || photo.back}
                alt={format(parseISO(photo.date), "d MMM yyyy")}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                {format(parseISO(photo.date), "d MMM yyyy", { locale: id })}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Photo Detail Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPhoto && format(parseISO(selectedPhoto.date), "d MMMM yyyy", { locale: id })}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPhoto && (
            <div className="space-y-4">
              {/* View Selector */}
              <div className="flex justify-center gap-2">
                {(["front", "side", "back"] as const).map((view) => (
                  selectedPhoto[view] && (
                    <Button
                      key={view}
                      variant={selectedView === view ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedView(view)}
                    >
                      {view === "front" ? "Depan" : view === "side" ? "Samping" : "Belakang"}
                    </Button>
                  )
                ))}
              </div>

              {/* Photo Display */}
              <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                <img
                  src={selectedPhoto[selectedView]!}
                  alt={selectedView}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Actions */}
              {onDelete && (
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      onDelete(selectedPhoto.date);
                      setSelectedPhoto(null);
                    }}
                  >
                    Hapus Foto
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
