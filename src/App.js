import './App.css';
import { useState } from 'react';
import GoogleLogin from './googlelogin'; // Import GoogleLogin component

function App() {
  const [selectedTab, setSelectedTab] = useState("description");

  return (
    <div className="App">
      <header className="App-header">
        Vision-Aid Partners - Spring 2024
      </header>
      <div>
        <ul>
          <li 
            onClick={() => setSelectedTab("description")}
            className={(selectedTab === "description" ? 'li-selected' : 'li-not-selected')}
          >Description</li>
          <li
            onClick={() => setSelectedTab("goals")}
            className={(selectedTab === "goals" ? 'li-selected' : 'li-not-selected')}
          >Goals</li>
        </ul>

        <div id="body">
          <div id="desc" className={(selectedTab === "description" ? 'selected' : 'not-selected')}>
            <p>
              The VA Partners team is dedicated to improving the partners application for the Vision
              Aid organization. This application is currently being used in production by the Vision
              Aid organization and its partners in hospitals around India.
            </p>
          </div>
          <div id="goals" className={(selectedTab === "goals" ? 'selected' : 'not-selected')}>
            <p>Our goals for this semester are as follows:</p>
            <p></p>
            <p></p>
            <ol>
              <li>Rewrite authentication system to be more seamless</li>
            </ol>
          </div>

        </div>
      </div>

      {/* Add GoogleLogin component */}
      <GoogleLogin />
    </div>
  );
}

export default App;
