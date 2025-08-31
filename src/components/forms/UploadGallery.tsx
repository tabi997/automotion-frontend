import { useState, useCallback } from "react";
import { Upload, X, Image, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_CONFIG, STORAGE_PATHS, validateFile } from "@/lib/storage";
import { env } from "@/lib/env";
import { useAdmin } from "@/hooks/use-admin";

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { isAdmin, loading: adminLoading, error: adminError } = useAdmin();

  const uploadToSupabase = useCallback(async (files: FileList) => {
    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const fileArray = Array.from(files);
      const uploadedUrls: string[] = [];

      for (const file of fileArray) {
        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${STORAGE_PATHS.vehicles}/${fileName}`;

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from(STORAGE_CONFIG.bucket)
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(STORAGE_CONFIG.bucket)
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      }

      const updatedImages = [...uploadedImages, ...uploadedUrls].slice(0, maxImages);
      setUploadedImages(updatedImages);
      onImagesChange(updatedImages);
      setSuccess(`Successfully uploaded ${uploadedUrls.length} image(s)`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
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
        uploadToSupabase(fileList.files);
      }
    }
  }, [uploadedImages.length, maxImages, uploadToSupabase]);

  // Check if upload is enabled
  if (!env.VITE_ENABLE_UPLOAD) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Upload functionality is disabled. Set VITE_ENABLE_UPLOAD=true in your environment.
        </AlertDescription>
      </Alert>
    );
  }

  // Check if Supabase is properly configured
  if (!(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_PUBLISHABLE_KEY)) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Supabase configuration is missing. Please check your environment variables.
        </AlertDescription>
      </Alert>
    );
  }

  // Check admin status
  if (adminLoading) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Verificare status admin...
        </AlertDescription>
      </Alert>
    );
  }

  if (adminError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Eroare la verificarea statusului admin: {adminError}
        </AlertDescription>
      </Alert>
    );
  }

  if (!isAdmin && !env.VITE_BYPASS_ADMIN_FOR_UPLOAD) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Accesul la upload este restricționat doar pentru administratori.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Button */}
      <div className="relative">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={isUploading || uploadedImages.length >= maxImages}
        />
        <Button
          type="button"
          variant="default"
          className={cn(
            "w-full h-32 border-2 border-dashed border-border hover:border-primary/50 transition-colors relative z-0",
            isUploading && "opacity-50 cursor-not-allowed",
            uploadedImages.length >= maxImages && "opacity-50 cursor-not-allowed"
          )}
          disabled={isUploading || uploadedImages.length >= maxImages}
        >
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-primary-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium text-primary-foreground">
                {isUploading ? "Se încarcă..." : "Încarcă imagini"}
              </p>
              <p className="text-xs text-primary-foreground/80">
                {uploadedImages.length}/{maxImages} imagini încărcate
              </p>
            </div>
          </div>
        </Button>
      </div>

      {/* Status Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Image Gallery */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-full object-cover"
                />
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