// src/services/docService.js
import api from "./api";

/**
 * Upload a single file (multer expects "file")
 * onProgress(percent: number|null) - optional callback
 * returns the created Document object (res.data)
 */
export async function uploadDocumentFile(file, { onProgress, signal } = {}) {
  const form = new FormData();
  form.append("file", file); // key name must match multer upload.single("file")

  const config = {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (ev) => {
      if (!onProgress) return;
      const { loaded, total } = ev;
      const percent = total ? Math.round((loaded * 100) / total) : null;
      onProgress(percent);
    },
  };

  // Attach AbortController signal if provided and axios supports it
  if (signal) config.signal = signal;

  const { data } = await api.post("/docs/upload", form, config);
  return data;
}

export const fetchDocuments = async () => {
  const res = await api.get("/docs");
  return res.data;
};
