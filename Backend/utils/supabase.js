import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service_role or anon key
);

const BUCKET_NAME = "documents"; // create this in Supabase Storage

// Upload file
export const uploadFile = async (fileBuffer, filename, mimetype) => {
  const uniqueName = `uploads/${Date.now()}-${filename}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(uniqueName, new Uint8Array(fileBuffer), {
      contentType: mimetype,
      upsert: false,
    });

  if (error) throw error;

  // ✅ Correct for private bucket
  const { data: signedUrl, error: signedError } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(uniqueName, 60 * 60); // valid for 1 hour

  if (signedError) throw signedError;

  return { url: signedUrl.signedUrl, path: uniqueName };
};

// Delete file
export const deleteFile = async (path) => {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
  if (error) throw error;
};
