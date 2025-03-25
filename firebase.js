import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

    const firebaseConfig = {
        apiKey: "AIzaSyCgYr2g3NyP0V7LtSS8tSuzDmxWA_FNhFE",
        authDomain: "pets-2024.firebaseapp.com",
        projectId: "pets-2024",
        storageBucket: "pets-2024.appspot.com",
        messagingSenderId: "346960568568",
        appId: "1:346960568568:web:eaffa20f6332b90fba9b0d"
      
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
