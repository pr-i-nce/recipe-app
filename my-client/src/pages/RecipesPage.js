import React, { useState, useEffect } from 'react';
import RecipesNavbar from '../components/Navbar/RecipesNavbar';
import RecipeCard from '../components/RecipeCard';
import Footer from '../components/Footer';
import axios from 'axios';
import UploadRecipe from '../components/UploadRecipePopup';

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]); // State for filtered recipes
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = () => {
    setLoading(true);
    axios.get('http://localhost:5000/recipes')
      .then(response => {
        setRecipes(response.data);
        setFilteredRecipes(response.data); // Initialize with all recipes
        setError(null);
      })
      .catch(error => {
        setError('Failed to fetch recipes. Please try again later.');
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Update filtered recipes based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes); // Show all recipes if search term is empty
    }
  }, [searchTerm, recipes]);

  const handleRecipeUploaded = () => {
    fetchRecipes(); // Refresh the recipe list after upload
  };

  const handleRecipeUpdated = () => {
    fetchRecipes(); // Refresh the recipe list after update
  };

  const handleToggleFavorite = (recipeId, isFavorite) => {
    axios.post(`http://localhost:5000/recipes/${recipeId}/favorite`)
      .then(() => {
        // Update the favorite status locally without needing to refetch all recipes
        setRecipes(prevRecipes =>
          prevRecipes.map(recipe =>
            recipe.id === recipeId ? { ...recipe, isFavorite: !isFavorite } : recipe
          )
        );
      })
      .catch(error => {
        setError('Failed to update favorite status. Please try again later.');
        console.error(error);
      });
  };

  return (
    <div>
      <RecipesNavbar />
      <button onClick={() => setIsUploading(!isUploading)}>
        {isUploading ? 'Cancel Upload' : 'Upload Recipe'}
      </button>
      {isUploading && (
        <UploadRecipe onRecipeUploaded={handleRecipeUploaded} />
      )}
      
      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          className="search-input" // Optional class for styling
        />
      </div>

      {loading && <p>Loading recipes...</p>} {/* Loading Indicator */}
      {error && <p className="error-message">{error}</p>} {/* Error Message */}
      
      <div className="recipe-container">
        {!loading && filteredRecipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onRecipeUpdated={handleRecipeUpdated}
            onToggleFavorite={() => handleToggleFavorite(recipe.id, recipe.isFavorite)} // Pass the toggle function
            isFavorite={recipe.isFavorite} // Assuming recipes have an isFavorite field
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default RecipesPage;