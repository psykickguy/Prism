import mongoose from "mongoose";

const clauseSchema = new mongoose.Schema({
  clause: { type: String, required: true }, // exact line from document
  simplified: { type: String }, // simplified explanation
  riskLevel: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
});

const analysisSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: true,
  },

  //   userId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User", // optional but useful for multi-user system
  //   },

  type: {
    type: String,
    enum: [
      "summary",
      "clause_explanation",
      "query_response",
      "highlight_risk",
      "recommendation",
      "hidden_terms",
    ],
    required: true,
  },

  input: { type: String }, // e.g. clause text or user query
  output: { type: String }, // Gemini response / simplified explanation

  // --- specific sections ---
  clauses: [clauseSchema], // used for highlight_risk + clause_explanation

  hiddenTerms: [
    {
      term: { type: String },
      page: { type: Number }, // optional, helps locate
      explanation: { type: String },
    },
  ],

  recommendations: [
    {
      point: { type: String }, // short bullet points
    },
  ],

  metadata: {
    type: Object,
    default: {},
    // e.g. { page: 2, coords: [x1, y1, x2, y2], riskLevel: "high" }
  },

  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed",
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Analysis", analysisSchema);
