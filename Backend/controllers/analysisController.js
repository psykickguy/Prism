import Analysis from "../models/Analysis.js";
import Document from "../models/Document.js";
import callGemini from "../utils/gemini.js";

export const createAnalysis = async (req, res) => {
  try {
    const { documentId, type, input } = req.body;

    // 1. Ensure document exists
    const doc = await Document.findById(documentId);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    let userMessage = input;
    let systemPrompt = "";

    // If no input, auto-generate from document text
    if (!userMessage && doc.extractedText) {
      userMessage = doc.extractedText;
    }

    // 2. Decide behavior based on type
    switch (type) {
      case "summary":
        userMessage = doc.extractedText
          ? `Summarize the following document:\n\n${doc.extractedText}`
          : input;
        systemPrompt =
          "You are a legal AI assistant. Provide a clear, concise summary.";
        break;

      case "clause_explanation":
        systemPrompt =
          "You are a legal AI assistant. Explain this clause in simple terms.";
        break;

      case "highlight_risk":
        systemPrompt = `You are a legal risk analyst. 
        Identify risks in the following clause/document text. 
        Return ONLY JSON in this format:
        {
          "clauses": [
            { "clause": "original text", "simplified": "plain english", "riskLevel": "low|medium|high" }
          ]
        }`;
        break;

      case "recommendation":
        systemPrompt = `You are a legal advisor. 
        Provide 3–5 actionable recommendations in bullet points. 
        Return ONLY JSON in this format:
        { "recommendations": [ "point1", "point2", "point3" ] }`;
        break;

      case "hidden_terms":
        systemPrompt = `You are a legal AI assistant. 
        Find hidden fees, unfair terms, or buried obligations in the text. 
        Return ONLY JSON in this format:
        { "hiddenTerms": [ "term1", "term2" ] }`;
        break;

      case "query_response":
        systemPrompt =
          "You are a legal assistant. Answer the user’s query based on the given clause or document.";
        break;

      default:
        return res.status(400).json({ error: "Invalid analysis type" });
    }

    // 3. Call Gemini
    const rawOutput = await callGemini(systemPrompt, userMessage);

    // Try to parse JSON if structured
    let parsedOutput;
    try {
      parsedOutput = JSON.parse(rawOutput);
    } catch {
      parsedOutput = null;
    }

    // 4. Handle extra fields depending on type
    const analysisData = {
      documentId,
      type,
      input: userMessage, // <-- auto-generate input if none
      output: rawOutput, // always save raw for debugging
      status: "completed",
    };

    if (parsedOutput?.clauses) {
      analysisData.clauses = parsedOutput.clauses;
    }

    if (parsedOutput?.recommendations) {
      // Normalize if it's an array of strings
      analysisData.recommendations = parsedOutput.recommendations.map((r) =>
        typeof r === "string" ? { point: r } : r
      );
    }

    if (parsedOutput?.hiddenTerms) {
      // Normalize if it's just strings
      analysisData.hiddenTerms = parsedOutput.hiddenTerms.map((t) =>
        typeof t === "string" ? { term: t } : t
      );
    }

    // if (parsedOutput?.summary) {
    //   analysisData.summary = parsedOutput.summary;
    // }

    // 5. Save and return
    const analysis = new Analysis(analysisData);
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
