import express from "express";
import multer from "multer";
import {
  uploadDocument,
  getDocument,
  listDocuments,
  deleteDocument,
} from "../controllers/docsController.js";

const router = express.Router();
const upload = multer({
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
}); // memory storage

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/:id", getDocument);
router.get("/", listDocuments);
router.delete("/:id", deleteDocument);

export default router;
