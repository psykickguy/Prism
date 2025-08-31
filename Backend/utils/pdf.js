import pdf from "pdf-parse";

const extractPdfText = async (fileBuffer) => {
  const data = await pdf(fileBuffer);
  return {
    text: data.text,
    pageCount: data.numpages,
    info: data.info,
  };
};

export default extractPdfText;
