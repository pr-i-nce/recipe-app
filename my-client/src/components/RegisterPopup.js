import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPopup = ({ onClose }) => { // Accept onClose as a prop
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null); // For profile photo upload
  const navigate = useNavigate(); // Use the navigate function from useNavigate

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    if (photo) {
      formData.append('photo', photo); // Append photo if there is one
    }

    try {
      const response = await axios.post('http://localhost:5000/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Assuming the response includes an access token
      const { accessToken } = response.data; // Adjust this line based on actual response structure

      // Store the access token in local storage
      localStorage.setItem('token', accessToken);

      alert('Registration successful! Please log in.');
      setUsername('');
      setEmail('');
      setPassword('');
      setPhoto(null); // Clear the file input

      onClose(); // Close the popup on successful registration
      navigate('/recipes'); // Redirect to RecipesPage

    } catch (error) {
      console.error(error);
      alert('Registration failed, please try again.');
    }
  };

  return (
    <div className="register-popup">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
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
        <input
          type="file"
          onChange={(e) => setPhoto(e.target.files[0])}
        />
        <button type="submit">Register</button>
        <button type="button" onClick={onClose}>Close</button>
      </form>
    </div>
  );
};

export default RegisterPopup;