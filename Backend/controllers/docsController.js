import Document from "../models/Document.js";
import { uploadFile, deleteFile } from "../utils/supabase.js";
import extractPdfText from "../utils/pdf.js"; // your pdf-parse utility
import { asyncHandler } from "../utils/errorHandler.js";
import { normalizeFileType, isSupportedFileType } from "../utils/fileType.js";

// Upload a document
export const uploadDocument = asyncHandler(async (req, res) => {
  const file = req.file; // assuming using multer
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  if (!isSupportedFileType(file.mimetype)) {
    return res.status(400).json({ error: "Unsupported file type" });
  }

  // Upload to Supabase
  const fileData = await uploadFile(
    file.buffer,
    file.originalname,
    file.mimetype
  );

  // Extract PDF text (if PDF)
  let extractedText = "";
  let metadata = {};
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype.startsWith("image/")
  ) {
    const pdfData = await extractPdfText(file.buffer);
    extractedText = pdfData.text;
    metadata = { pageCount: pdfData.pageCount, info: pdfData.info };
  }

  const doc = await Document.create({
    title: file.originalname, // or user-provided title
    fileUrl: fileData.url, // signed/public URL
    filePath: fileData.path, // raw path inside bucket
    fileType: normalizeFileType(file.mimetype),
    extractedText,
    // summary: "", // will be filled after AI processing
    // clauses: [], // optional, filled after AI clause-by-clause analysis
    // hiddenTerms: [], // optional for future
    status: "uploaded",
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // example: auto-delete in 24h
    metadata,
  });

  res.status(201).json(doc);
});

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
