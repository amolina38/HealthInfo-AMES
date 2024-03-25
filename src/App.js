import './App.css';
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  sendPasswordResetEmail, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, query, where, getFirestore } from 'firebase/firestore';

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
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Access the navigation object

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        fetchBlogEntries(user.uid);
      }
    });

    return () => unsubscribe(); // Unsubscribe when component unmounts
  }, []);

  const db = getFirestore(); // Get Firestore object after initializing Firebase

  const [blogEntries, setBlogEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const fetchBlogEntries = async (userId) => {
    try {
      const q = query(collection(db, 'blogEntries'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const entries = [];
      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() });
      });
      setBlogEntries(entries);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddEntry = async () => {
    try {
      await addDoc(collection(db, 'blogEntries'), {
        userId: user.uid,
        title,
        content,
      });
      fetchBlogEntries(user.uid);
      setTitle('');
      setContent('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("Account exists with email provided");
          break;
        case "auth/weak-password":
          setError("Password must be at least 6 characters");
          break;
        case "auth/missing-password":
          setError("Invalid Password");
          break;
        case "auth/invalid-email":
          setError("Invalid Email");
          break;
        default:
          setError("Invalid Credentials");
      }
    }
  };
  
  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("Account exists with email provided");
          break;
        case "auth/weak-password":
          setError("Password must be at least 6 characters");
          break;
        case "auth/missing-password":
          setError("Invalid Password");
          break;
        case "auth/invalid-email":
          setError("Invalid Email");
          break;
        default:
          setError("An error occurred");
      }
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setError("If an account with this email exists, a password reset email has been sent");
    } catch (error) {
      setError("Invalid email");
    }
  };

  return (
    <div className="App">
      <h1>AMES Medication Tracker</h1>
      {!user && (
        <>
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
          <button onClick={handleForgotPassword}>Forgot Password</button>
          {error && <div>{error}</div>}
        </>
      )}
      {user && (
        <>
          <h2>Create New Blog Entry</h2>
          <div>
            <label>Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label>Content:</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <button onClick={handleAddEntry}>Add Entry</button>
          {error && <div>{error}</div>}
          <h2>Your Blog Entries</h2>
          <ul>
            {blogEntries.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.title}</strong>
                <p>{entry.content}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
