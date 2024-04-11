// home.js

import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where, getFirestore } from 'firebase/firestore';
import medicationsData from './medications.json';
import './styles.css';

const auth = getAuth();

function Home() {
    const navigate = useNavigate();
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedMedication, setSelectedMedication] = useState('');
    const [blogEntries, setBlogEntries] = useState([]);
    const [error, setError] = useState(null);

    const db = getFirestore();

    // exract medications and their codes from JSON
    const medicationOptions = Object.entries(medicationsData.medications).map(([name, code]) => ({
        name,
        code
    }));

    useEffect(() => {
        fetchBlogEntries();
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchBlogEntries();
            }
        });
        return unsubscribe;
    }, []);

    const fetchBlogEntries = async () => {
        try {
            if (!auth.currentUser) return;
            const q = query(collection(db, 'blogEntries'), where('userId', '==', auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            const entries = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // fetch medication name based on medication code
                const medicationName = getMedicationName(data.medicationCode);
                entries.push({ id: doc.id, ...data, medicationName });
            });

            // sort entries by date in descending order by date (newest to oldest)
            entries.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });

            setBlogEntries(entries);
        } catch (error) {
            setError(error.message);
        }
    };

    // fetch medication name based on medication code
    const getMedicationName = (code) => {
        const medication = medicationOptions.find((med) => med.code === code);
        return medication ? medication.name : '';
    };

    const handleCreateBlogPost = async (e) => {
        e.preventDefault(); // prevent default form submission behavior
        try {
            if (!auth.currentUser) return;
            // fetch medication name based on medication code
            const medication = medicationOptions.find((med) => med.code === selectedMedication);
            if (!medication) {
                setError("Please select a valid medication.");
                return;
            }
            
            await addDoc(collection(db, 'blogEntries'), {
                date,
                notes,
                medicationCode: selectedMedication,
                medicationName: medication.name,
                userId: auth.currentUser.uid,
            });
            setDate('');
            setNotes('');
            setSelectedMedication('');
            fetchBlogEntries();
        } catch (error) {
            setError(error.message);
        }
    };
    

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
        }
    };

    return (
        <div className="container">
            <h2>Medication Records</h2>

            {/* Medication Dropdown */}
            <form onSubmit={handleCreateBlogPost}>
                <div className="entry-options">
                    {/* Select Medication */}
                    <div>
                        <label>Select Medication:</label>
                        <select value={selectedMedication} onChange={(e) => setSelectedMedication(e.target.value)} required>
                            <option value="">Select</option>
                            {medicationOptions.map((medication) => (
                                <option key={medication.code} value={medication.code}>{medication.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date Picker */}
                    <div>
                        <label>Date:</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required/>
                    </div>

                    {/* Notes */}
                    <div>
                        <label>Notes:</label>
                        <textarea className="notes-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>
                <button type="submit" className="submit-btn">Submit New Entry</button>
                {error && <div>{error}</div>}
                </div>
            </form>

            {/* List of Posts */}
            {/* <h3>Medication History</h3> */}
            <ul>
                {blogEntries.map((entry) => (
                    <li key={entry.id} className="blog-entry">
                        <div className="medication-name">{entry.medicationName}</div>
                        <div className="date">{entry.date}</div>
                        <div className="notes">{entry.notes}</div>
                    </li>
                ))}
            </ul>

            {/* Sign-out button */}
            <button className="sign-out-btn" onClick={handleSignOut}>Sign Out</button>
        </div>
    );
}

export default Home;
