import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { getToken } from '../utils';
import { useNavigate } from 'react-router-dom';
import './SupportPopup.css';

const SupportPopup = ({ onClose }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { authData, setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authData.token) {
      const tokenFromLocalStorage = getToken();
      if (tokenFromLocalStorage) {
        setAuthData((prevData) => ({ ...prevData, token: tokenFromLocalStorage }));
      } else {
        console.error('No authentication token found.');
      }
    }
  }, [authData.token, setAuthData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authData.token) {
      alert('User not authenticated.');
      return;
    }

    try {
      await axios.post(
        'https://recipe-app-0i3m.onrender.com/support/tickets',
        { subject, message },
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );
      alert('Support ticket submitted successfully!');
      setSubject('');
      setMessage('');
      if (onClose) onClose();
      navigate('/recipes');
    } catch (error) {
      console.error('Error submitting support ticket:', error);

      if (error.response) {
        switch (error.response.status) {
          case 400:
            alert('Please provide both subject and message.');
            break;
          case 404:
            alert('User not found.');
            break;
          default:
            alert('There was an error submitting your support ticket.');
        }
      } else {
        alert('Network error. Please try again later.');
      }
    }
  };

  return (
    <div className="support-popup">
      <h2>Support</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default SupportPopup;
