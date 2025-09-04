import express from "express";
import {
  createAnalysis,
  getAnalysesByDocument,
  getAnalysis,
  deleteAnalysis,
} from "../controllers/analysisController.js";

const router = express.Router();

router.post("/", createAnalysis); // create new analysis
router.get("/document/:documentId", getAnalysesByDocument); // get all analyses for doc
router.get("/:id", getAnalysis); // get single analysis
router.delete("/:id", deleteAnalysis); // delete

export default router;
