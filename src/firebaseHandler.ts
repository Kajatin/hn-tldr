import { getApp, initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { Post } from "./types";

function createFirebaseApp() {
  try {
    return getApp();
  } catch {
    return initializeApp(JSON.parse(process.env.FIREBASE_CONFIG || "{}"));
  }
}

// Initialize Firebase
const app = createFirebaseApp();

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export async function handleNewPost(post: Post) {
  try {
    // Convert date to a string
    const dateString = new Date(post.createdAt).toISOString().split("T")[0];

    // Add a new document
    const docRef = doc(db, dateString, post.id.toString());
    const success = await setDoc(docRef, post).then(async () => {
      const docSnap = await getDoc(docRef);

      return docSnap.exists();
    });

    return success;
  } catch (error) {
    console.error(error);
  }

  return false;
}

export default app;
export { db };
