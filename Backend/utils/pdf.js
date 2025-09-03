import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
import Tesseract from "tesseract.js";

/**
 * Extract text from PDF buffer.
 * Handles normal PDFs and scanned PDFs with OCR.
 *
 * @param {Buffer} fileBuffer
 * @param {boolean} returnPositions - whether to include coordinates for highlighting (optional)
 */
const extractPdfText = async (fileBuffer, returnPositions = false) => {
  try {
    // Step 1: Load PDF using pdfjs-dist
    const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
    const pdf = await loadingTask.promise;

    let extractedText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      extractedText += content.items.map((item) => item.str).join(" ") + "\n";
    }

    if (extractedText.trim().length > 0) {
      // PDF has selectable text
      return {
        text: extractedText,
        pageCount: pdf.numPages,
        info: pdf.info,
        positions: returnPositions ? [] : undefined, // for future use
        method: "pdfjs",
      };
    }

    // Step 2: If no text found, fallback to OCR
    console.log("No text found in PDF, running OCR...");

    const {
      data: { text },
    } = await Tesseract.recognize(fileBuffer, "eng", {
      logger: (m) => console.log(m),
    });

    return {
      text,
      pageCount: 0, // OCR doesn’t give page count
      info: {},
      positions: returnPositions ? [] : undefined,
      method: "ocr",
    };
  } catch (err) {
    console.error("PDF extraction error:", err);
    throw err;
  }
};

export default extractPdfText;
