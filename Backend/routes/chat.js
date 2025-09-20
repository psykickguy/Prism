import express from "express";
import {
  chatGeneral,
  chatWithDocument,
} from "../controllers/chatController.js";

const router = express.Router();

// General chat
router.post("/general", chatGeneral);

// Document-specific chat
router.post("/document/:docId", chatWithDocument);

export default router;
