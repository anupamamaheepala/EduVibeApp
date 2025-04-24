import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDemFkqu34oGmsvtfFnnr3Im8jDoXfmm3s",
  authDomain: "eduvibeapp-26502.firebaseapp.com",
  projectId: "eduvibeapp-26502",
  storageBucket: "eduvibeapp-26502.firebasestorage.app", // ✅ MUST be exactly this format
  messagingSenderId: "672064114622",
  appId: "1:672064114622:web:0980385860c00b5f8b73ef",
  measurementId: "G-V93NSSCTRV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app); // ✅ Make sure this is defined

export { storage };