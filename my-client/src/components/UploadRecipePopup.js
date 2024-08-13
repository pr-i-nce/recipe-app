import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Adjust this path based on your project structure
import './UploadRecipePopup.css'; // Optional: Include any additional styles

const UploadRecipePopup = ({ onClose, onRecipeAdded }) => {
  const { authData } = useContext(AuthContext); // Access the authData from AuthContext
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: '',
    instructions: '',
    main_photo: null,
  });
  const [error, setError] = useState(null); // To handle errors

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    try {
      const token = authData.token; // Get the token from authData
      const response = await axios.post('http://localhost:5000/recipes', data, {
        headers: {
          Authorization: `Bearer ${token}`, // Use the token from authData. Do NOT set Content-Type.
        },
      });

      // Check for successful response
      if (response.status === 200 || response.status === 201) {
        alert('Recipe uploaded successfully');
        onRecipeAdded(); // Notify parent about the new recipe
        setFormData({
          name: '',
          description: '',
          ingredients: '',
          instructions: '',
          main_photo: null,
        }); // Clear form
        onClose(); // Close the popup
      } else {
        setError('Failed to upload recipe. Please try again.');
      }
    } catch (error) {
      console.error("Error uploading recipe:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to upload recipe. Please try again.");
    }
  };

  return (
    <div className="upload-recipe-popup">
      <button onClick={onClose}>Close</button>
      <h2>Upload New Recipe</h2>
      {error && <p className="error">{error}</p>} {/* Show error message if exists */}
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
          type="file"
          name="main_photo"
          accept="image/*"
          onChange={handleChange}
        />
        
        <button type="submit">Upload Recipe</button>
      </form>
    </div>
  );
};

export default UploadRecipePopup;