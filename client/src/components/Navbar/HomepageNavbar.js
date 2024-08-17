import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginPopup from '../LoginPopup'; 
import RegisterPopup from '../RegisterPopup';  

const HomepageNavbar = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);

  // Function to open the Login Popup
  const handleOpenLogin = () => setShowLoginPopup(true);
  
  // Function to close the Login Popup
  const handleCloseLogin = () => setShowLoginPopup(false);
  
  // Function to open the Register Popup
  const handleOpenRegister = () => setShowRegisterPopup(true);
  
  // Function to close the Register Popup
  const handleCloseRegister = () => setShowRegisterPopup(false);

  // Handle opening LoginPopup from RegisterPopup
  const handleRegisterSuccess = () => {
    handleCloseRegister(); // Close the RegisterPopup
    handleOpenLogin(); // Open the LoginPopup after successful registration
  };

  return (
    <nav>
      <div className="logo">Recipe Haven</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <span onClick={handleOpenLogin} className="nav-item">Login</span>
        <span onClick={handleOpenRegister} className="nav-item">Register</span>
      </div>
      {showLoginPopup && <LoginPopup onClose={handleCloseLogin} />}
      {showRegisterPopup && (
        <RegisterPopup
          isOpen={showRegisterPopup} // Passing the open state
          onClose={handleCloseRegister} // Function to close the modal
          onRegisterSuccess={handleRegisterSuccess} // Callback for successful registration
        />
      )}
    </nav>
  );
}

export default HomepageNavbar;