import React from 'react';
import { auth } from './firebase';

const Header = () => {
  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        // Signed out successfully
      })
      .catch((error) => {
        // Handle errors
      });
  };

  return (
    <header>
      <h1>My App</h1>
      <button onClick={handleSignOut}>Sign Out</button>
    </header>
  );
};

export default Header;
