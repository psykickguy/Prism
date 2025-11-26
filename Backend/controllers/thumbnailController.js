// controllers/thumbnailController.js
import fetch from "node-fetch"; // optional if your Node doesn't have global fetch
import Document from "../models/Document.js";
import { asyncHandler } from "../utils/errorHandler.js";
import generateThumbnailBuffer from "../utils/generateThumbnail.js";
import { uploadFile } from "../utils/supabase.js";

/**
 * POST /docs/:id/generate-thumbnail
 * Downloads the PDF (using doc.fileUrl), generates a PNG thumbnail of page 1,
 * uploads thumbnail to storage, saves thumbnailUrl + thumbnailPath on Document.
 */
export const generateThumbnailForDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doc = await Document.findById(id);
  if (!doc) return res.status(404).json({ error: "Document not found" });

  if (!doc.fileUrl) {
    return res.status(400).json({ error: "Document.fileUrl missing" });
  }

  // 1) Download the PDF from signed URL (works if token valid)
  const resp = await fetch(doc.fileUrl);
  if (!resp.ok) {
    return res.status(502).json({
      error: "Failed to download PDF from fileUrl",
      status: resp.status,
    });
  }
  const arrayBuffer = await resp.arrayBuffer();
  const pdfBuffer = new Uint8Array(arrayBuffer);

  // 2) Generate thumbnail buffer (first page)
  let thumbBuffer;
  try {
    thumbBuffer = await generateThumbnailBuffer(pdfBuffer);
  } catch (err) {
    console.error("Thumbnail generation failed:", err);
    return res
      .status(500)
      .json({ error: "Thumbnail generation failed", details: String(err) });
  }

  if (!thumbBuffer) {
    return res
      .status(500)
      .json({ error: "Thumbnail generation returned empty buffer" });
  }

  // 3) Upload thumbnail
  const safeName = (doc.title || "document").replace(/\s+/g, "-").slice(0, 200);
  const filename = `${Date.now()}-${safeName}-thumbnail.png`;
  const uploaded = await uploadFile(thumbBuffer, filename, "image/png");

  // 4) Save thumbnail info to document
  doc.thumbnailUrl = uploaded.url;
  doc.thumbnailPath = uploaded.path;
  doc.status = doc.status === "uploaded" ? "processed" : doc.status;
  await doc.save();

  res.json({
    message: "thumbnail generated",
    thumbnailUrl: doc.thumbnailUrl,
    docId: doc._id,
  });
});
