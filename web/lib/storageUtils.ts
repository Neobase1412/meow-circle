// web/lib/storageUtils.ts
import { createClient } from '@/lib/supabase/client'; // Use client-side for browser uploads

// Helper function to generate unique file names for storage
function generateUniqueFileName(userId: string, folder: string, fileName: string): string {
    const fileExt = fileName.split('.').pop() || 'file';
    const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    // Basic sanitization (replace non-alphanumeric with underscore)
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50); // Allow underscore/dash
    return `${userId}/${folder}/${Date.now()}-${sanitizedBaseName}.${fileExt}`;
}

// Function to upload multiple files to a specific bucket and folder structure
export async function uploadFilesToSupabase(
    files: File[],
    bucketName: string,
    folderName: string, // e.g., 'posts', 'avatars'
    userId: string
): Promise<{ successfulUrls: string[], errors: string[] }> {

    if (!files || files.length === 0 || !userId) {
        return { successfulUrls: [], errors: [] };
    }

    const supabase = createClient(); // Get client-side client
    const successfulUrls: string[] = [];
    const errors: string[] = [];

    const uploadPromises = files.map(async (file) => {
        // Generate path like: [user_id]/[folderName]/[timestamp]-[sanitized_name].ext
        const filePath = generateUniqueFileName(userId, folderName, file.name);

        try {
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false, // Use unique names to avoid accidental overwrites
                });

            if (uploadError) {
                console.error(`Supabase upload error for ${file.name}:`, uploadError);
                throw new Error(`無法上傳檔案: ${file.name} (${uploadError.message})`);
            }

            // Get public URL after successful upload
            const { data: urlData } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            if (!urlData?.publicUrl) {
                console.error(`Failed to get public URL for ${filePath}`);
                throw new Error(`無法取得檔案 URL: ${file.name}`);
            }
            return urlData.publicUrl; // Resolve promise with the URL

        } catch (err: any) {
            console.error(`Error processing file ${file.name}:`, err);
            // Throw the specific error message to be collected by allSettled
            throw new Error(err.message || `處理檔案 ${file.name} 時發生錯誤`);
        }
    });

    // Wait for all uploads to settle
    const results = await Promise.allSettled(uploadPromises);

    // Collect successful URLs and error messages
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            successfulUrls.push(result.value);
        } else {
            // Capture the error message for reporting
            errors.push(result.reason?.message || `檔案 ${files[index]?.name || index + 1} 上傳失敗`);
            console.error(`Upload failed for file index ${index}:`, result.reason);
        }
    });

    return { successfulUrls, errors };
}