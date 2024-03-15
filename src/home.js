import React from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const auth = getAuth();


function Home() {
    const navigate = useNavigate();
  
    const handleSignOut = async () => {
      try {
        // Sign out the user
        await signOut(auth);
        // Redirect to the login page upon successful sign-out
        navigate('/');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };
  
    return (
        <div>
            <h2>Medication History</h2>
            <div>
                <label htmlFor="dropdown1">Medication:</label>
                <select id="dropdown1">
                    <option value="">Select an option</option>
                    <option value="option1">Option 1</option>
                </select>
            </div>
            <div>
                <label htmlFor="dropdown1">Dosage:</label>
                <select id="dropdown1">
                    <option value="">Select an option</option>
                    <option value="option1">Option 1</option>
                </select>
            </div>
            <div>
                <label htmlFor="dropdown2">Frequency:</label>
                <select id="dropdown2">
                    <option value="">Select an option</option>
                    <option value="option1">Option 1</option>
                </select>
            </div>
            <div>
                <label htmlFor="dropdown3">Physician:</label>
                <select id="dropdown3">
                    <option value="">Select an option</option>
                    <option value="option1">Option 1</option>
                </select>
            </div>
            <button onClick={handleSignOut}>Sign Out</button> {/* Sign-out button */}
        </div>
    );
}

export default Home;
