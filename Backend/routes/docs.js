import express from "express";
import multer from "multer";
import {
  uploadDocument,
  getDocument,
  listDocuments,
  deleteDocument,
} from "../controllers/docsController.js";
import { generateThumbnailForDocument } from "../controllers/thumbnailController.js"; // NEW

const router = express.Router();
// const upload = multer({
//   limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
// }); // memory storage

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/:id", getDocument);
router.get("/", listDocuments);
router.delete("/:id", deleteDocument);

// routes/docs.js (or wherever)
router.post("/:id/generate-thumbnail", generateThumbnailForDocument);

export default router;
