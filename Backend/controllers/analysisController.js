import Analysis from "../models/Analysis.js";
import Document from "../models/Document.js";
import callGemini from "../utils/gemini.js";

// Create a new analysis (summary, clause explanation, etc.)
export const createAnalysis = async (req, res) => {
  try {
    const { documentId, type, input } = req.body;

    // Check if document exists
    const doc = await Document.findById(documentId);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Prepare system prompt
    let userMessage = input;

    // If it's a summary request and we have text in the document
    if (type === "summary" && doc.extractedText) {
      userMessage = `Summarize the following document:\n\n${doc.extractedText}`;
    }

    const systemPrompt = `You are an AI that analyzes documents. Task: ${type}`;
    const output = await callGemini(systemPrompt, userMessage);

    const analysis = new Analysis({
      documentId,
      type,
      input,
      output,
      status: "completed",
    });

    await analysis.save();

    res.status(201).json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create analysis" });
  }
};

// Get all analyses for a document
export const getAnalysesByDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const analyses = await Analysis.find({ documentId });
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analyses" });
  }
};

// Get single analysis
export const getAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) return res.status(404).json({ error: "Not found" });
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analysis" });
  }
};

// Delete analysis
export const deleteAnalysis = async (req, res) => {
  try {
    await Analysis.findByIdAndDelete(req.params.id);
    res.json({ message: "Analysis deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete analysis" });
  }
};
