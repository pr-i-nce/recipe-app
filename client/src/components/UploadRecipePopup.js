import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './UploadRecipePopup.css'; // Optional: Include any additional styles

const UploadRecipePopup = ({ onClose, onRecipeAdded }) => {
  const { authData } = useContext(AuthContext); // Access the authData from AuthContext
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: '',
    instructions: '',
    main_photo: '', // URL or empty string
  });
  const [error, setError] = useState(null); // To handle errors

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    // Ensure the main photo URL is set
    if (!formData.main_photo) {
      setError('Main photo is required.');
      return;
    }

    // Ensure token is present and valid
    if (!authData || !authData.token) {
      setError('You must be logged in to upload a recipe.');
      return;
    }

    // Create a new FormData object to send form data, including the URL
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('ingredients', formData.ingredients);
    data.append('instructions', formData.instructions);
    data.append('main_photo_url', formData.main_photo); // URL submission

    try {
      const token = authData.token; // Get the token from authData
      const response = await axios.post('https://recipe-app-0i3m.onrender.com/recipes', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert('Recipe uploaded successfully');
        onRecipeAdded(); // Notify parent component about new recipe
        onClose(); // Close the popup
      } else {
        setError('Failed to upload recipe. Please try again.');
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'An error occurred while uploading the recipe. Please try again.'
      );
    }
  };

  return (
    <div className="upload-recipe-popup">
      <button onClick={onClose}>Close</button>
      <h2>Upload New Recipe</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleUpload}>
        <input
          type="text"
          name="name"
          placeholder="Recipe Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <textarea
          name="ingredients"
          placeholder="Ingredients (comma-separated)"
          value={formData.ingredients}
          onChange={handleChange}
          required
        />
        <textarea
          name="instructions"
          placeholder="Instructions"
          value={formData.instructions}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="main_photo"
          placeholder="Photo URL"
          value={formData.main_photo}
          onChange={handleChange}
          required
        />
        <button type="submit">Upload Recipe</button>
      </form>
    </div>
  );
};

export default UploadRecipePopup;
