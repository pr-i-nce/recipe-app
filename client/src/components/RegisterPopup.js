import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal'; // Import the modal

const RegisterPopup = ({ isOpen, onClose, onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      await axios.post('https://recipe-app-0i3m.onrender.com/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Registration successful! Please log in.');

      setUsername('');
      setEmail('');
      setPassword('');
      setPhoto(null);
      onRegisterSuccess();
      onClose(); // Close modal after successful registration

    } catch (error) {
      console.error(error);
      alert('Registration failed, please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
        </form>
      </div>
    </Modal>
  );
};

export default RegisterPopup;