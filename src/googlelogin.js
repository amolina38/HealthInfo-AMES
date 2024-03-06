import React, { useEffect, useState } from 'react';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Load the Google JavaScript Client Library
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: '184597501203-raslcm8kftggdta3ahqqks2j6n9rpq05.apps.googleusercontent.com',
      }).then(() => {
        const authInstance = window.gapi.auth2.getAuthInstance();
        setIsSignedIn(authInstance.isSignedIn.get());

        // Listen for sign-in state changes
        authInstance.isSignedIn.listen((signedIn) => {
          setIsSignedIn(signedIn);
        });
      });
    });
  }, []);

  const handleSignIn = () => {
    const authInstance = window.gapi.auth2.getAuthInstance();
    authInstance.signIn();
  };

  const handleSignOut = () => {
    const authInstance = window.gapi.auth2.getAuthInstance();
    authInstance.signOut();
  };

  return (
    <div>
      {isSignedIn ? (
        <div>
          <p>User is signed in!</p>
          <button onClick={handleSignOut}>Sign out</button>
        </div>
      ) : (
        <button onClick={handleSignIn}>Sign in with Google</button>
      )}
    </div>
  );
}

export default App;
