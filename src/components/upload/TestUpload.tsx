import { useState, useCallback, useEffect } from "react";
import { Upload, X, Image, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_CONFIG, STORAGE_PATHS, validateFile } from "@/lib/storage";
import { env } from "@/lib/env";

export function TestUpload() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Debug function to check storage access
  useEffect(() => {
    const checkStorage = async () => {
      try {
        console.log('🔍 Debug: Checking storage access...');
        
        // Check environment variables
        const envDebug = {
          VITE_SUPABASE_URL: env.VITE_SUPABASE_URL,
          VITE_SUPABASE_PUBLISHABLE_KEY: env.VITE_SUPABASE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing',
          VITE_ENABLE_UPLOAD: env.VITE_ENABLE_UPLOAD,
          VITE_STORAGE_BUCKET: env.VITE_STORAGE_BUCKET,
          STORAGE_CONFIG_BUCKET: STORAGE_CONFIG.bucket,
          STORAGE_PATHS_VEHICLES: STORAGE_PATHS.vehicles
        };
        
        console.log('🔍 Debug: Environment:', envDebug);
        
        // Check if we can list buckets
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        console.log('🔍 Debug: Buckets list:', { buckets, error: bucketsError });
        
        // Check if we can access the specific bucket
        const targetBucket = env.VITE_STORAGE_BUCKET || 'vehicle-images';
        const { data: files, error: bucketError } = await supabase.storage
          .from(targetBucket)
          .list('', { limit: 1 });
        
        console.log('🔍 Debug: Bucket access:', { 
          bucket: targetBucket, 
          files, 
          error: bucketError 
        });
        
        setDebugInfo({
          env: envDebug,
          buckets: buckets || [],
          bucketAccess: { bucket: targetBucket, files: files || [], error: bucketError },
          bucketsError
        });
        
      } catch (err) {
        console.error('🔍 Debug: Error checking storage:', err);
        setDebugInfo({ error: err.message });
      }
    };
    
    checkStorage();
  }, []);

  const uploadToSupabase = useCallback(async (files: FileList) => {
    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('🔍 Debug: Starting upload...');
      console.log('🔍 Debug: Target bucket:', env.VITE_STORAGE_BUCKET);
      console.log('🔍 Debug: STORAGE_CONFIG.bucket:', STORAGE_CONFIG.bucket);
      
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
        
        console.log('🔍 Debug: Uploading to path:', filePath);
        console.log('🔍 Debug: Using bucket:', STORAGE_CONFIG.bucket);

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from(STORAGE_CONFIG.bucket)
          .upload(filePath, file);

        if (uploadError) {
          console.error('🔍 Debug: Upload error:', uploadError);
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(STORAGE_CONFIG.bucket)
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      }

      setUploadedImages(prev => [...prev, ...uploadedUrls]);
      setSuccess(`Successfully uploaded ${uploadedUrls.length} image(s)`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const remainingSlots = STORAGE_CONFIG.maxFiles - uploadedImages.length;
      const filesToUpload = Array.from(files).slice(0, remainingSlots);
      
      if (filesToUpload.length > 0) {
        const fileList = new DataTransfer();
        filesToUpload.forEach(file => fileList.items.add(file));
        uploadToSupabase(fileList.files);
      }
    }
  }, [uploadedImages.length, uploadToSupabase]);

  const removeImage = useCallback((indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  }, []);

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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Upload Component</CardTitle>
          <CardDescription>
            This component tests the upload button visibility and Supabase storage integration.
            Environment: {(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_PUBLISHABLE_KEY) ? '✅ Valid Supabase' : '❌ Invalid Supabase'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Debug Information */}
          {debugInfo && (
            <div className="bg-gray-100 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold">🔍 Debug Information:</h4>
              <div className="text-sm space-y-1">
                <div><strong>Environment:</strong></div>
                <div>• VITE_STORAGE_BUCKET: {debugInfo.env?.VITE_STORAGE_BUCKET || 'undefined'}</div>
                <div>• STORAGE_CONFIG.bucket: {debugInfo.env?.STORAGE_CONFIG_BUCKET || 'undefined'}</div>
                <div>• STORAGE_PATHS.vehicles: {debugInfo.env?.STORAGE_PATHS_VEHICLES || 'undefined'}</div>
                
                <div className="mt-2"><strong>Available Buckets:</strong></div>
                {debugInfo.buckets?.map((bucket: any, index: number) => (
                  <div key={index}>• {bucket.name} ({bucket.public ? 'Public' : 'Private'})</div>
                )) || <div>• No buckets found</div>}
                
                {debugInfo.bucketAccess && (
                  <>
                    <div className="mt-2"><strong>Target Bucket Access:</strong></div>
                    <div>• Bucket: {debugInfo.bucketAccess.bucket}</div>
                    <div>• Files: {debugInfo.bucketAccess.files.length}</div>
                    {debugInfo.bucketAccess.error && (
                      <div>• Error: {debugInfo.bucketAccess.error.message}</div>
                    )}
                  </>
                )}
                
                {debugInfo.bucketsError && (
                  <div className="mt-2 text-red-600">
                    <strong>Buckets List Error:</strong> {debugInfo.bucketsError.message}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isUploading || uploadedImages.length >= STORAGE_CONFIG.maxFiles}
            />
            <Button
              type="button"
              variant="default"
              className={`
                w-full h-32 border-2 border-dashed border-border hover:border-primary/50 transition-colors relative z-0
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                ${uploadedImages.length >= STORAGE_CONFIG.maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              disabled={isUploading || uploadedImages.length >= STORAGE_CONFIG.maxFiles}
            >
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-8 w-8 text-primary-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium text-primary-foreground">
                    {isUploading ? "Se încarcă..." : "Încarcă imagini"}
                  </p>
                  <p className="text-xs text-primary-foreground/80">
                    {uploadedImages.length}/{STORAGE_CONFIG.maxFiles} imagini încărcate
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

          {/* Configuration Info */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Storage Bucket: {STORAGE_CONFIG.bucket}</p>
            <p>Max File Size: {(STORAGE_CONFIG.maxFileSize / 1024 / 1024).toFixed(2)}MB</p>
            <p>Max Files: {STORAGE_CONFIG.maxFiles}</p>
            <p>Allowed Types: {STORAGE_CONFIG.allowedMimeTypes.join(', ')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
