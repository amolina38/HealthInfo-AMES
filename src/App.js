import './App.css';
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCoszVeeqcBdMTl_RKBLMjoIS9bWt5AHlg",
  authDomain: "ames-med.firebaseapp.com",
  projectId: "ames-med",
  storageBucket: "ames-med.appspot.com",
  messagingSenderId: "167208301541",
  appId: "1:167208301541:web:b27e9d2831f198e85b350c",
  measurementId: "G-46J7QJLGR1"
};

initializeApp(firebaseConfig); // Initialize Firebase

const auth = getAuth(); // Get auth object after initializing Firebase

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
              console.log('User is signed in.');
          } else {
              console.log('No user is signed in.');
          }
      });

      return () => unsubscribe(); // Unsubscribe when component unmounts
  }, []);

  const handleLogin = async () => {
      try {
          await signInWithEmailAndPassword(auth, email, password);
          // Login successful, you can redirect or perform other actions here
          console.log('Login successful');
      } catch (error) {
          setError(error.message);
      }
  };

  const handleSignUp = async () => {
      try {
          await createUserWithEmailAndPassword(auth, email, password);
          // Account creation successful, you can redirect or perform other actions here
          console.log('Account creation successful');
      } catch (error) {
          setError(error.message);
      }
  };

  return (
      <div className="App">
          <h1>Login</h1>
          <div>
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
              <label>Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleSignUp}>Sign Up</button>
          {error && <div>{error}</div>}
      </div>
  );
}

export default App;