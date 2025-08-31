import { TestUpload } from "@/components/upload/TestUpload";
import { Container } from "@/components/common/Container";

export default function TestUploadPage() {
  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-6">Test Upload Page</h1>
        <p className="text-muted-foreground mb-8">
          This page tests the upload button visibility and Supabase storage integration.
          Use this to debug any upload-related issues.
        </p>
        <TestUpload />
      </div>
    </Container>
  );
}
