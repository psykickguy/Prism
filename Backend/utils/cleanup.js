import { Document } from "../models/Document.js";
import { deleteFile } from "./firebase.js";

const cleanupExpiredDocuments = async () => {
  const now = new Date();
  const expiredDocs = await Document.find({ expiresAt: { $lt: now } });

  for (let doc of expiredDocs) {
    try {
      await deleteFile(doc.fileUrl);
      await Document.deleteOne({ _id: doc._id });
      console.log(`Cleaned up: ${doc.filename}`);
    } catch (err) {
      console.error("Cleanup error:", err);
    }
  }
};

export default cleanupExpiredDocuments;
