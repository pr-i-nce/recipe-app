import React from 'react';
import { Link } from 'react-router-dom';

const RecipesNavbar = () => {
  return (
    <nav>
      <div className="logo">Recipe Haven</div> {/* Optional: Add a logo */}
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
}

export default RecipesNavbar;