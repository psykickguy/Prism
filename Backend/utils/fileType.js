export const normalizeFileType = (mimetype) => {
  if (!mimetype) return "other";

  if (mimetype.includes("pdf")) return "pdf";
  if (mimetype.includes("word") || mimetype === "application/msword")
    return "docx";
  if (mimetype.includes("text")) return "txt";
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.includes("excel") || mimetype === "application/vnd.ms-excel")
    return "excel";
  if (mimetype.includes("opendocument")) return "odt";
  return "other";
};

export const isSupportedFileType = (mimetype) => {
  const supportedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "image/jpeg",
    "image/png",
    "image/tiff",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.oasis.opendocument.text",
  ];
  return supportedTypes.includes(mimetype);
};
