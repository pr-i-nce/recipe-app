import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Modal.css'; // Ensure this is the same CSS file for consistent styling

const LoginPopup = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://recipe-app-0i3m.onrender.com/login', { 
        username: email,
        password 
      });

      const { identity, access_token, is_admin } = response.data;
      setAuthData({ user: identity, token: access_token, isAdmin: is_admin });
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('is_admin', is_admin);

      alert('Login successful!');
      setEmail('');
      setPassword('');
      onClose();

      if (is_admin) {
        navigate("/admin");
      } else {
        navigate("/recipes");
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed, please check your credentials and try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="login-popup">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;