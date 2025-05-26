import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1DIEyhhp09pUl68n4T-CIlLIjRgQf3_k",
  authDomain: "wisdomhub-e6e68.firebaseapp.com",
  projectId: "wisdomhub-e6e68",
  storageBucket: "wisdomhub-e6e68.firebasestorage.app",
  messagingSenderId: "630835215128",
  appId: "1:630835215128:web:dedac4e7d55e8f0633fc6d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export default auth;