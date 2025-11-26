// controllers/docsController.js
import Document from "../models/Document.js";
import { uploadFile, deleteFile } from "../utils/supabase.js";
import extractPdfText from "../utils/pdf.js"; // keep your OCR/text extractor (or replace with robust version)
import generateThumbnailBuffer from "../utils/generateThumbnail.js";
import { asyncHandler } from "../utils/errorHandler.js";
import { normalizeFileType, isSupportedFileType } from "../utils/fileType.js";

export const uploadDocument = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  if (!isSupportedFileType(file.mimetype)) {
    return res.status(400).json({ error: "Unsupported file type" });
  }

  // 1) Upload original file to Supabase
  const originalFilename = `${Date.now()}-${file.originalname}`.slice(0, 220);
  let originalUpload;
  try {
    originalUpload = await uploadFile(
      file.buffer,
      originalFilename,
      file.mimetype
    );
  } catch (err) {
    console.error("Supabase original upload failed:", err);
    return res.status(500).json({ error: "Failed to upload file" });
  }

  // 2) Extract text if PDF/image (non-blocking: desired to be sync for this flow)
  let extractedText = "";
  let metadata = {};
  try {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("image/")
    ) {
      const pdfData = await extractPdfText(file.buffer);
      extractedText = pdfData.text || "";
      metadata = {
        pageCount: pdfData.pageCount || 0,
        info: pdfData.info || {},
      };
    }
  } catch (err) {
    // log but continue — extraction failure shouldn't break upload
    console.warn("Text extraction failed:", err);
  }

  // 3) Generate thumbnail automatically (if PDF or image). For other filetypes you can skip
  let thumbnailUrl = null;
  let thumbnailPath = null;
  try {
    if (file.mimetype === "application/pdf") {
      const thumbBuffer = await generateThumbnailBuffer(file.buffer, {
        scale: 1.5,
      });
      const safeName = (file.originalname || "document")
        .replace(/\s+/g, "-")
        .slice(0, 200);
      const thumbFilename = `${Date.now()}-${safeName}-thumbnail.png`;
      const uploadedThumb = await uploadFile(
        thumbBuffer,
        thumbFilename,
        "image/png"
      );
      thumbnailUrl = uploadedThumb.url;
      thumbnailPath = uploadedThumb.path;
    } else if (file.mimetype.startsWith("image/")) {
      // For images we can optionally create resized thumbnail; for simplicity reuse original
      // but you could run a resizing step with sharp or canvas.
      // Here we just upload the original image as thumbnail (optional)
      const safeName = (file.originalname || "image")
        .replace(/\s+/g, "-")
        .slice(0, 200);
      const thumbFilename = `${Date.now()}-${safeName}-thumbnail${getExtensionFromMime(
        file.mimetype
      )}`;
      const uploadedThumb = await uploadFile(
        file.buffer,
        thumbFilename,
        file.mimetype
      );
      thumbnailUrl = uploadedThumb.url;
      thumbnailPath = uploadedThumb.path;
    }
  } catch (err) {
    console.warn("Thumbnail generation/upload failed:", err);
    // don't fail the whole flow — continue but mark status or include error in metadata
    metadata.thumbnailError = String(err);
  }

  // 4) Save the Document to Mongo
  const doc = await Document.create({
    title: file.originalname,
    fileUrl: originalUpload.url,
    filePath: originalUpload.path,
    fileType: normalizeFileType(file.mimetype),
    extractedText,
    thumbnailUrl,
    thumbnailPath,
    status: thumbnailUrl ? "processed" : "uploaded",
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    metadata,
  });

  // 5) Return the document JSON (includes thumbnailUrl if generated)
  res.status(201).json(doc);
});

// helper to infer extension from mime
function getExtensionFromMime(mime) {
  if (!mime) return ".bin";
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  return ".img";
}

// Get a single document metadata
export const getDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Document not found" });
  res.json(doc);
});

// List all documents
export const listDocuments = asyncHandler(async (req, res) => {
  const query = req.user?.id ? { userId: req.user.id } : {};
  const docs = await Document.find(query).sort({ createdAt: -1 });
  res.json(docs);
});

// Delete a document
export const deleteDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Document not found" });

  // Delete from Firebase
  await deleteFile(doc.filePath);

  // Delete from MongoDB
  await Document.deleteOne({ _id: doc._id });

  res.json({ message: "Document deleted successfully" });
});
