import React, { useState } from 'react';
import SupportPopup from '../components/SupportPopup';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SupportPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(true); // Control popup visibility
  const navigate = useNavigate(); // Initialize useNavigate

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  return (
    <div>
      {isPopupOpen && <SupportPopup onClose={handleClosePopup} navigate={navigate} />}
      <Footer />
    </div>
  );
}

export default SupportPage;
