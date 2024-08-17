import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecipePopup.css'; // Optional: Include any additional styles

const RecipePopup = ({ recipeId, onClose }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true); // To display loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`https://recipe-app-0i3m.onrender.com/recipes/${recipeId}`);
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setError("Failed to load recipe. Please try again.");
      } finally {
        setLoading(false); // Stop loading regardless of the outcome
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!recipe) {
    return <p>No recipe found.</p>;
  }

  return (
    <div className="recipe-popup">
      <button className="close-button" onClick={onClose}>×</button>
      <h2>{recipe.name}</h2>
      <img src={recipe.main_photo} alt={recipe.name} />
      <p><strong>Description:</strong> {recipe.description}</p>
      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.split(', ').map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h3>Instructions</h3>
      <p>{recipe.instructions}</p>
      <h4>Author: {recipe.author}</h4>
      {/* Optional: Additional details or buttons */}
    </div>
  );
};

export default RecipePopup;
