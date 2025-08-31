import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String }, // e.g. "Rental Agreement"
  fileUrl: { type: String, required: true }, // Firebase URL
  fileType: { type: String, default: "pdf" },

  extractedText: { type: String }, // from pdf-parse / OCR
  summary: { type: String }, // Gemini simplified version
  clauses: [
    {
      clause: String, // Original clause text
      simplified: String, // AI explanation
      riskLevel: { type: String, enum: ["low", "medium", "high"] },
    },
  ],
  hiddenTerms: [String], // optional future feature

  status: {
    type: String,
    enum: ["uploaded", "processed", "analyzed"],
    default: "uploaded",
  },

  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

export default mongoose.model("Document", DocumentSchema);
