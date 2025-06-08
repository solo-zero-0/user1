import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import LoginSignup from './pages/LoginSignup';
import ContactUs from './pages/ContactUs';
import Profile from './pages/Profile';
import Questions from './pages/Questions';
import Chat from './pages/Chat';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || '');
        setUserEmail(user.email || '');
      } else {
        setUserName('');
        setUserEmail('');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserName('');
      setUserEmail('');
      localStorage.removeItem('userEmail');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <header style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', backgroundColor: '#004080', color: 'white' }}>
          <div style={{ flex: 1 }}>
            {(userName || userEmail) && (
              <span>
                Welcome{userName ? `, ${userName}` : ''}{userName && userEmail ? ` (${userEmail})` : ''}
              </span>
            )}
          </div>
          <nav>
            <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', gap: '1rem', margin: 0 }}>
              <li>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
              </li>
              {!userEmail ? (
                <>
                  <li>
                    <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login/Signup</Link>
                  </li>
                </>
              ) : (
                <>
                  <li style={{ display: 'flex', alignItems: 'center' }}>
                    <span
                      onClick={handleLogout}
                      style={{
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        textDecoration: 'none',
                        padding: 0,
                        margin: 0,
                        fontFamily: 'inherit',
                        fontWeight: 'inherit',
                        lineHeight: 'inherit',
                        display: 'inline',
                        verticalAlign: 'middle',
                      }}
                    >
                      Logout
                    </span>
                  </li>
                </>
              )}
              {userEmail && (
                <>
                  <li>
                    <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact Us</Link>
                  </li>
                  <li>
                    <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
                  </li>
                  <li>
                    <Link to="/chat" style={{ color: 'white', textDecoration: 'none' }}>Chat</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginSignup setUserName={setUserName} setUserEmail={setUserEmail} />} />
        <Route path="/contact" element={<ContactUs setUserName={setUserName} setUserEmail={setUserEmail} />} />
        <Route path="/profile" element={<Profile setUserName={setUserName} setUserEmail={setUserEmail} />} />
        <Route path="/questions/:testId" element={<Questions />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
