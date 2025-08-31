import { useState, useCallback } from "react";
import { Upload, X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadGalleryProps {
  onImagesChange: (imageIds: string[]) => void;
  maxImages?: number;
  minImages?: number;
  className?: string;
}

export function UploadGallery({ 
  onImagesChange, 
  maxImages = 10, 
  minImages = 3,
  className 
}: UploadGalleryProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const simulateUpload = useCallback(async (files: FileList) => {
    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock Cloudinary public IDs
    const newImageIds = Array.from(files).map((_, index) => 
      `autoorder/mock_${Date.now()}_${index}`
    );
    
    const updatedImages = [...uploadedImages, ...newImageIds].slice(0, maxImages);
    setUploadedImages(updatedImages);
    onImagesChange(updatedImages);
    setIsUploading(false);
  }, [uploadedImages, maxImages, onImagesChange]);

  const removeImage = useCallback((indexToRemove: number) => {
    const updatedImages = uploadedImages.filter((_, index) => index !== indexToRemove);
    setUploadedImages(updatedImages);
    onImagesChange(updatedImages);
  }, [uploadedImages, onImagesChange]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const remainingSlots = maxImages - uploadedImages.length;
      const filesToUpload = Array.from(files).slice(0, remainingSlots);
      
      if (filesToUpload.length > 0) {
        const fileList = new DataTransfer();
        filesToUpload.forEach(file => fileList.items.add(file));
        simulateUpload(fileList.files);
      }
    }
  }, [uploadedImages.length, maxImages, simulateUpload]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Button */}
      <div className="relative">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading || uploadedImages.length >= maxImages}
        />
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full h-32 border-2 border-dashed border-border hover:border-primary/50 transition-colors",
            isUploading && "opacity-50 cursor-not-allowed"
          )}
          disabled={isUploading || uploadedImages.length >= maxImages}
        >
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">
                {isUploading ? "Se încarcă..." : "Încarcă imagini"}
              </p>
              <p className="text-xs text-muted-foreground">
                {uploadedImages.length}/{maxImages} imagini încărcate
              </p>
            </div>
          </div>
        </Button>
      </div>

      {/* Image Gallery */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((imageId, index) => (
            <div key={imageId} className="relative group">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border">
                <Image className="h-8 w-8 text-muted-foreground" />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
              <p className="text-xs text-center mt-1 text-muted-foreground truncate">
                Imagine {index + 1}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Status Messages */}
      <div className="text-sm text-muted-foreground">
        {uploadedImages.length < minImages && (
          <p className="text-destructive">
            Mai sunt necesare {minImages - uploadedImages.length} imagini (minim {minImages})
          </p>
        )}
        {uploadedImages.length >= minImages && (
          <p className="text-success">
            ✓ Imaginile sunt suficiente ({uploadedImages.length}/{minImages} minim)
          </p>
        )}
      </div>
    </div>
  );
}