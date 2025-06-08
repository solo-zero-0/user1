import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [error, setError] = useState('');
  const [showVideo, setShowVideo] = useState(false);

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setShowVideo(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  return (
    <>
      {showVideo ? (
        <video
          src="https://media.istockphoto.com/id/2215600126/video/seamless-loop-digital-microchip-with-glowing-house-icon-and-circuit-board-smart-home.mp4?s=mp4-640x640-is&k=20&c=ECdGVVkqgVTQhSHB0U1OpRPHh95z9-BFKNcmXNFOknk="
          autoPlay
          onEnded={() => navigate('/')}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', margin: 0, padding: 0, border: 'none' }}
        />
      ) : (
        <div className="login-signup-container">
          <div className="emoji-container">
            <span className={`emoji ${isPasswordFocused ? 'focused' : ''}`}>
              {isPasswordFocused ? '🙈' : '🐵'}
            </span>
          </div>
          <div className="form-container">
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleSubmit}>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                required
              />
              {error && <p className="error-message">{error}</p>}
              <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
            </form>
            <button className="toggle-button" onClick={handleToggle}>
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginSignup;
