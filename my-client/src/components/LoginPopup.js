import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';  // Ensure your AuthContext is set up correctly
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const LoginPopup = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthData } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { 
        username: email,  // Assuming username is expected
        password 
      });

      // Set auth data in context
      setAuthData({ user: response.data.identity, token: response.data.access_token }); 
      alert('Login successful!');
      setEmail('');
      setPassword('');
      onClose();  // Close the popup on successful login
     
      // Redirect to RecipesPage
      navigate("/recipes");  // Adjust the path to your RecipesPage route
    } catch (error) {
      console.error(error);
      alert('Login failed, please check your credentials and try again.');
    }
  };

  return (
    <div className="login-popup">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"  // Assuming username is expected
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
      <button onClick={onClose}>Close</button> {/* Button to close the popup */}
    </div>
  );
};

export default LoginPopup;