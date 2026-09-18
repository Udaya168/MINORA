import { supabase } from "@/integrations/supabase/client";

export const PRODUCT_IMAGES_BUCKET = "product-images";
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

export interface FileValidationResult {
  valid: boolean;
  error?: string | undefined;
}

export interface UploadResult {
  success: boolean;
  publicUrl?: string | undefined;
  path?: string | undefined;
  error?: string | undefined;
}

/**
 * Validates product/avatar image file format and size
 */
export function validateImageFile(file: File): FileValidationResult {
  if (!file) {
    return { valid: false, error: "No file selected." };
  }

  const fileType = file.type?.toLowerCase();
  const fileExt = file.name.split(".").pop()?.toLowerCase();
  
  const isValidMime = ALLOWED_MIME_TYPES.includes(fileType);
  const isValidExt = ["jpg", "jpeg", "png", "webp"].includes(fileExt || "");

  if (!isValidMime && !isValidExt) {
    return {
      valid: false,
      error: `Invalid file format (${fileExt || "unknown"}). Only JPG, JPEG, PNG, and WEBP images are allowed.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds the 5 MB limit. Please select a smaller image.`,
    };
  }

  return { valid: true };
}

/**
 * Verifies storage bucket configuration for product-images
 */
export async function ensureBucketExists(): Promise<boolean> {
  // The bucket 'product-images' is created via Supabase SQL/Dashboard policies.
  // Standard frontend clients interact directly with storage.from('product-images').upload/getPublicUrl/remove.
  // Avoiding administrative /storage/v1/bucket API calls prevents HTTP 400 console errors.
  return true;
}

/**
 * Uploads a product image file to Supabase Storage
 */
export async function uploadProductImage(
  productId: string,
  file: File
): Promise<UploadResult> {
  console.log(`[STORAGE] Upload started`);
  console.log(`[STORAGE] Bucket: ${PRODUCT_IMAGES_BUCKET}`);
  console.log(`[STORAGE] File: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);

  // 1. Verify Authentication
  const { data: authSession } = await supabase.auth.getSession();
  if (!authSession || !authSession.session) {
    const errorMsg = "Admin authentication required before uploading product image.";
    console.error(`[STORAGE] Upload failed: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }

  // 2. Validate file
  const validation = validateImageFile(file);
  if (!validation.valid) {
    console.error(`[STORAGE] Upload failed: ${validation.error}`);
    return { success: false, error: validation.error };
  }

  // 3. Ensure Storage Bucket exists
  await ensureBucketExists();

  // 4. Generate unique file path
  const sanitizedId = (productId || "new-product").toLowerCase().replace(/[^a-z0-9_-]/g, "");
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `products/${sanitizedId}/${uniqueName}`;

  try {
    // 5. Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || `image/${fileExt}`,
      });

    if (uploadError) {
      console.error(`[STORAGE] Upload failed:`, uploadError);
      
      let userError = uploadError.message || "Failed to upload product image.";
      if (uploadError.message?.includes("Bucket not found") || (uploadError as any).code === "NoSuchBucket") {
        userError = `Storage bucket '${PRODUCT_IMAGES_BUCKET}' not found in Supabase project. Please execute SQL setup in Supabase SQL Editor.`;
      } else if (uploadError.message?.includes("row-level security") || (uploadError as any).statusCode === "403") {
        userError = "Permission denied. Only authorized store admins can upload product images.";
      }

      return { success: false, error: userError };
    }

    console.log(`[STORAGE] Upload successful: ${uploadData.path}`);

    // 6. Generate Public URL
    const { data: publicUrlData } = supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .getPublicUrl(uploadData.path);

    const publicUrl = publicUrlData?.publicUrl;

    if (!publicUrl) {
      console.error(`[STORAGE] Upload failed: Could not generate public URL.`);
      return { success: false, error: "Failed to generate public URL for uploaded image." };
    }

    return {
      success: true,
      publicUrl,
      path: uploadData.path,
    };
  } catch (err: any) {
    console.error(`[STORAGE] Upload failed:`, err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred during image upload.",
    };
  }
}

/**
 * Uploads a user profile avatar image to Supabase Storage
 */
export async function uploadProfileAvatar(
  userId: string,
  file: File
): Promise<UploadResult> {
  console.log(`[STORAGE] Upload started`);
  console.log(`[STORAGE] Bucket: ${PRODUCT_IMAGES_BUCKET}`);
  console.log(`[STORAGE] File: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);

  const { data: authSession } = await supabase.auth.getSession();
  if (!authSession || !authSession.session) {
    const errorMsg = "User authentication required before uploading profile picture.";
    console.error(`[STORAGE] Upload failed: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }

  const validation = validateImageFile(file);
  if (!validation.valid) {
    console.error(`[STORAGE] Upload failed: ${validation.error}`);
    return { success: false, error: validation.error };
  }

  await ensureBucketExists();

  const sanitizedUserId = (userId || "user").toLowerCase().replace(/[^a-z0-9_-]/g, "");
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "png";
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `avatars/${sanitizedUserId}/${uniqueName}`;

  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || `image/${fileExt}`,
      });

    if (uploadError) {
      console.error(`[STORAGE] Upload failed:`, uploadError);
      
      let userError = uploadError.message || "Failed to upload profile picture.";
      if (uploadError.message?.includes("Bucket not found") || (uploadError as any).code === "NoSuchBucket") {
        userError = `Storage bucket '${PRODUCT_IMAGES_BUCKET}' not found. Please ensure the bucket is created in Supabase.`;
      }
      return { success: false, error: userError };
    }

    console.log(`[STORAGE] Upload successful: ${uploadData.path}`);

    const { data: publicUrlData } = supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .getPublicUrl(uploadData.path);

    const publicUrl = publicUrlData?.publicUrl;
    if (!publicUrl) {
      console.error(`[STORAGE] Upload failed: Could not generate public URL.`);
      return { success: false, error: "Failed to generate public URL for avatar." };
    }

    return {
      success: true,
      publicUrl,
      path: uploadData.path,
    };
  } catch (err: any) {
    console.error(`[STORAGE] Upload failed:`, err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred during profile image upload.",
    };
  }
}

/**
 * Extracts storage path from a full public Supabase storage URL
 */
export function extractStoragePath(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  
  const bucketMarker = `/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`;
  if (url.includes(bucketMarker)) {
    return url.split(bucketMarker)[1] || null;
  }
  
  if (url.includes(`/${PRODUCT_IMAGES_BUCKET}/`)) {
    return url.split(`/${PRODUCT_IMAGES_BUCKET}/`)[1] || null;
  }

  return null;
}

/**
 * Removes a product image or profile picture from Supabase Storage by its public URL
 */
export async function deleteProductImageByUrl(url: string): Promise<boolean> {
  const path = extractStoragePath(url);
  if (!path) {
    return false;
  }

  try {
    const { data, error } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .remove([path]);

    if (error) {
      console.error(`[STORAGE] Delete failed for path '${path}':`, error.message);
      return false;
    }
    console.log(`[STORAGE] Storage image deleted: ${path}`);
    return true;
  } catch (err) {
    console.error(`[STORAGE] Delete failed exception:`, err);
    return false;
  }
}

/**
 * Removes multiple product images from Supabase Storage by their URLs
 */
export async function deleteProductImages(urls: string[]): Promise<void> {
  if (!urls || urls.length === 0) return;
  for (const url of urls) {
    await deleteProductImageByUrl(url);
  }
}
