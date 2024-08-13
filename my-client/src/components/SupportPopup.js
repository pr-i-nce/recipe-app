import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Adjust the path as necessary

const SupportPopup = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { authData } = useContext(AuthContext); // Get authData from AuthContext

  useEffect(() => {
    // No need to fetch token separately; it's already part of authData
    if (!authData.token) {
      console.error('No authentication token found.');
    }
  }, [authData.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for authentication
    if (!authData.token) {
      alert('User not found or not authenticated.');
      return;
    }

    try {
      await axios.post('/support/tickets',
        { subject, message },
        {
          headers: {
            Authorization: `Bearer ${authData.token}` // Send JWT token in Authorization header
          }
        }
      );
      alert('Support ticket submitted successfully!');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error(error);
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
}

export default SupportPopup;
