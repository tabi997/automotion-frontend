import { test, expect } from '@playwright/test';

test.describe('Upload Button Visibility', () => {
  test('should show upload button on test upload page', async ({ page }) => {
    // Navigate to the test upload page
    await page.goto('/admin/test-upload');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the upload button is visible
    const uploadButton = page.locator('button:has-text("Încarcă imagini")');
    await expect(uploadButton).toBeVisible();
    
    // Verify button text content
    await expect(uploadButton).toContainText('Încarcă imagini');
    
    // Check if the upload icon is present
    const uploadIcon = page.locator('svg[class*="h-8 w-8"]');
    await expect(uploadIcon).toBeVisible();
    
    // Verify the button is not disabled initially
    await expect(uploadButton).not.toBeDisabled();
  });

  test('should show proper status when upload is disabled', async ({ page }) => {
    // Mock environment variables to disable upload
    await page.addInitScript(() => {
      // Mock the environment check
      window.mockEnv = {
        VITE_ENABLE_UPLOAD: false,
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'test-key'
      };
    });
    
    await page.goto('/admin/test-upload');
    await page.waitForLoadState('networkidle');
    
    // Should show disabled message
    const disabledMessage = page.locator('text=Upload functionality is disabled');
    await expect(disabledMessage).toBeVisible();
  });

  test('should show proper status when Supabase is not configured', async ({ page }) => {
    // Mock environment variables to remove Supabase config
    await page.addInitScript(() => {
      window.mockEnv = {
        VITE_ENABLE_UPLOAD: true,
        VITE_SUPABASE_URL: undefined,
        VITE_SUPABASE_ANON_KEY: undefined
      };
    });
    
    await page.goto('/admin/test-upload');
    await page.waitForLoadState('networkidle');
    
    // Should show Supabase config error
    const configError = page.locator('text=Supabase configuration is missing');
    await expect(configError).toBeVisible();
  });

  test('should handle file input correctly', async ({ page }) => {
    await page.goto('/admin/test-upload');
    await page.waitForLoadState('networkidle');
    
    // Create a mock file
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('input[type="file"]').click();
    const fileChooser = await fileChooserPromise;
    
    // Verify file input accepts images
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toHaveAttribute('accept', 'image/*');
    await expect(fileInput).toHaveAttribute('multiple');
  });
});
