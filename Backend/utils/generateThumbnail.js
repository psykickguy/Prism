// utils/generateThumbnail.js
import { createCanvas } from "canvas";

/**
 * Try multiple ways to import pdfjs-dist and locate getDocument.
 * Returns an object with getDocument function.
 */
async function loadPdfJsFlexible() {
  const tried = [];

  // Helper to inspect and return usable object
  function pick(mod, label) {
    tried.push({ label, keys: Object.keys(mod || {}) });
    if (!mod) return null;
    if (typeof mod.getDocument === "function") return mod;
    if (mod.default && typeof mod.default.getDocument === "function")
      return mod.default;
    if (mod.PDFJS && typeof mod.PDFJS.getDocument === "function")
      return mod.PDFJS;
    return null;
  }

  // 1) Prefer legacy build (v2)
  try {
    const legacy = await import("pdfjs-dist/legacy/build/pdf.js");
    const found = pick(legacy, "legacy/build/pdf.js");
    if (found) {
      console.log("pdfjs: loaded legacy/build/pdf.js");
      return { pdfjs: found, tried };
    }
  } catch (e) {
    tried.push({
      label: "legacy/build/pdf.js - import failed",
      error: String(e),
    });
  }

  // 2) Try direct root import (v3+ or bundles)
  try {
    const root = await import("pdfjs-dist");
    const found = pick(root, "pdfjs-dist (root)");
    if (found) {
      console.log("pdfjs: loaded pdfjs-dist root");
      return { pdfjs: found, tried };
    }
  } catch (e) {
    tried.push({ label: "pdfjs-dist root - import failed", error: String(e) });
  }

  // 3) Try alternate build entry (some installs)
  try {
    const build = await import("pdfjs-dist/build/pdf.js");
    const found = pick(build, "pdfjs-dist/build/pdf.js");
    if (found) {
      console.log("pdfjs: loaded pdfjs-dist/build/pdf.js");
      return { pdfjs: found, tried };
    }
  } catch (e) {
    tried.push({
      label: "pdfjs-dist/build/pdf.js - import failed",
      error: String(e),
    });
  }

  // 4) Try es5 build path (sometimes present)
  try {
    const es5 = await import("pdfjs-dist/es5/build/pdf.js");
    const found = pick(es5, "pdfjs-dist/es5/build/pdf.js");
    if (found) {
      console.log("pdfjs: loaded pdfjs-dist/es5/build/pdf.js");
      return { pdfjs: found, tried };
    }
  } catch (e) {
    tried.push({
      label: "pdfjs-dist/es5/build/pdf.js - import failed",
      error: String(e),
    });
  }

  // Nothing worked
  const err = new Error("pdfjs-dist loaded but getDocument not found");
  err.tried = tried;
  throw err;
}

function toUint8Array(data) {
  if (!data) return null;
  if (data instanceof Uint8Array) return data;
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (Buffer.isBuffer(data))
    return new Uint8Array(data.buffer, data.byteOffset, data.length);
  throw new Error("Unsupported PDF data type");
}

export default async function generateThumbnailBuffer(rawData, options = {}) {
  const { scale = 1.5 } = options;

  const { pdfjs, tried } = await loadPdfJsFlexible().catch((err) => {
    // rethrow with helpful info to be returned to metadata
    err.tried = err.tried || err.tried || tried;
    throw err;
  });

  // At this point pdfjs.getDocument should exist
  if (!pdfjs || typeof pdfjs.getDocument !== "function") {
    const e = new Error("pdfjs-dist loaded but getDocument not found");
    e.tried = tried;
    throw e;
  }

  const uint8 = toUint8Array(rawData);
  if (!uint8) throw new Error("Invalid PDF data");

  const loadingTask = pdfjs.getDocument({ data: uint8 });
  const pdf = await loadingTask.promise;

  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale });

  const canvas = createCanvas(
    Math.ceil(viewport.width),
    Math.ceil(viewport.height)
  );
  const ctx = canvas.getContext("2d");

  const renderTask = page.render({ canvasContext: ctx, viewport });
  if (renderTask && renderTask.promise) {
    await renderTask.promise;
  } else {
    await renderTask;
  }

  return canvas.toBuffer("image/png");
}
