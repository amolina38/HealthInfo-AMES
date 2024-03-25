import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where, getFirestore } from 'firebase/firestore';

const auth = getAuth();

function Home() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [blogEntries, setBlogEntries] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBlogEntries();
    }, []);

    const db = getFirestore(); // Get Firestore object after initializing Firebase

    const fetchBlogEntries = async () => {
        try {
            const q = query(collection(db, 'blogEntries'), where('userId', '==', auth.currentUser.uid));
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

    const handleCreateBlogPost = async () => {
        console.log('Creating blog post...');
        try {
            // Your existing code to create a blog post
            await addDoc(collection(db, 'blogEntries'), {
                title,
                content,
                userId: auth.currentUser.uid,
            });
            console.log('Blog post created successfully');
            setTitle('');
            setContent('');
            fetchBlogEntries();
        } catch (error) {
            console.error('Error creating blog post:', error);
            setError(error.message);
        }
    };
    

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div>
            <h2>Medication History</h2>

            {/* Blog Post Form */}
            <div>
                <label>Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
                <label>Content:</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <button onClick={handleCreateBlogPost}>Create Blog Post</button>
            {error && <div>{error}</div>}

            {/* List of Blog Posts */}
            <h3>Your Blog Posts</h3>
            <ul>
                {blogEntries.map((entry) => (
                    <li key={entry.id}>
                        <strong>{entry.title}</strong>
                        <p>{entry.content}</p>
                    </li>
                ))}
            </ul>

            {/* Sign-out button */}
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    );
}

export default Home;
