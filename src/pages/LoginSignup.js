import React, { useState } from 'react';
import './LoginSignup.css';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle login/signup logic
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  return (
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
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <button className="toggle-button" onClick={handleToggle}>
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default LoginSignup;
