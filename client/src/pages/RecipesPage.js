import React, { useState, useEffect } from 'react';
import RecipesNavbar from '../components/Navbar/RecipesNavbar';
import RecipeCard from '../components/RecipeCard';
import Footer from '../components/Footer';
import axios from 'axios';
import UploadRecipePopup from '../components/UploadRecipePopup'; // Update this import

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]); // State for filtered recipes
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [isUploading, setIsUploading] = useState(false); // To manage popup state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = () => {
    setLoading(true);
    axios.get('https://recipe-app-0i3m.onrender.com/recipes')
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
    setIsUploading(false); // Close the upload popup after successful upload
  };

  return (
    <div>
      <RecipesNavbar />
      <button onClick={() => setIsUploading(!isUploading)}>
        {isUploading ? 'Cancel Upload' : 'Upload Recipe'}
      </button>
      {isUploading && (
        <UploadRecipePopup 
          onClose={() => setIsUploading(false)} // Close the popup when "Close" is clicked
          onRecipeAdded={handleRecipeUploaded}  // Refresh recipes after upload
        />
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
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default RecipesPage;
