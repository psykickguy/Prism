import "dotenv/config";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadFile = async (fileBuffer, filename, mimetype) => {
  const uniqueName = `uploads/${Date.now()}-${filename}`;
  const fileRef = ref(storage, uniqueName);
  await uploadBytes(fileRef, fileBuffer, { contentType: mimetype });
  const url = await getDownloadURL(fileRef);
  return { url, path: uniqueName };
};

// export default uploadFile;

// export async function uploadFile(fileBuffer, filename, mimetype) {
//   const fileRef = ref(storage, `uploads/${Date.now()}-${filename}`);
//   await uploadBytes(fileRef, fileBuffer, { contentType: mimetype });
//   return getDownloadURL(fileRef);
// }

export const deleteFile = async (path) => {
  const fileRef = ref(storage, path);
  return deleteObject(fileRef);
};
