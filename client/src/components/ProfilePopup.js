import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import RecipePopup from './RecipePopup';
import { useNavigate } from 'react-router-dom';
import './ProfilePopup.css';

const ProfilePopup = ({ onClose }) => {
  const { authData } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState('');
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null); // Store selected recipe ID

  // Password handling states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileResponse = await axios.get('https://recipe-app-0i3m.onrender.com/user/profile', {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        });

        const userProfile = profileResponse.data;
        setUsername(userProfile.username);
        setEmail(userProfile.email);
        setCurrentPhoto(userProfile.profile_photo);

        const recipesResponse = await axios.get('https://recipe-app-0i3m.onrender.com/user/favorites', {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        });
        setFavoriteRecipes(recipesResponse.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Failed to fetch profile information. Please try again.');
      }
    };

    fetchProfile();
  }, [authData.token]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);

    if (profilePhoto) {
      formData.append('photo', profilePhoto);
    }
    if (newPassword) {
      formData.append('password', newPassword);
    }

    try {
      const response = await axios.put('https://recipe-app-0i3m.onrender.com/user/profile', formData, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Profile update response:', response.data);
      alert('Profile updated successfully!');
      if (typeof onClose === 'function') {
        onClose(); // Close the popup if onClose is passed and is a function
      }
      navigate('/recipes'); // Redirect to RecipesPage after successful update
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Failed to update profile: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleRecipeClick = (recipeId) => {
    setSelectedRecipeId(recipeId); // Set selected recipe ID
  };

  const handleCloseRecipePopup = () => {
    setSelectedRecipeId(null); // Clear selected recipe ID to close the popup
  };

  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
    navigate('/recipes'); // Redirect to RecipesPage on close
  };

  return (
    <div className="profile-popup">
      <h2 className="profile-title">Profile</h2>
      <form onSubmit={handleUpdateProfile} className="profile-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="profile-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="profile-input"
        />
        <input
          type="password"
          placeholder="New Password (leave blank if not changing)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="profile-input"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="profile-input"
        />
        {currentPhoto && (
          <img src={`https://recipe-app-0i3m.onrender.com/uploads/${currentPhoto}`} alt="Profile" className="profile-photo" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePhoto(e.target.files[0])}
          className="profile-file-input"
        />
        <button type="submit" className="profile-button">Update</button>
      </form>
      <h3 className="favorite-recipes-title">Favorite Recipes:</h3>
      <ul className="favorite-recipes-list">
        {favoriteRecipes.map((recipe) => (
          <li key={recipe.id} onClick={() => handleRecipeClick(recipe.id)} className="favorite-recipe-item">
            {recipe.name}
          </li>
        ))}
      </ul>
      {/* Render RecipePopup if a recipe is selected */}
      {selectedRecipeId && <RecipePopup recipeId={selectedRecipeId} onClose={handleCloseRecipePopup} />}
      <button onClick={handleClose} className="close-button">Close</button>
    </div>
  );
};

export default ProfilePopup;
