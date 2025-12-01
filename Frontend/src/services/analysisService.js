// src/services/analysisService.js
import api from "./api"; // your axios instance

export const fetchAnalysesForDocument = async (documentId) => {
  const res = await api.get(`/analyses/document/${documentId}`);
  return res.data; // array of Analysis objects
};

export const fetchSingleAnalysis = async (analysisId) => {
  const res = await api.get(`/analyses/${analysisId}`);
  return res.data;
};
