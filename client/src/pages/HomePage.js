import React, { useEffect, useState } from 'react';
import HomepageNavbar from '../components/Navbar/HomepageNavbar';
import RecipeCard from '../components/RecipeCard';
import Footer from '../components/Footer';
import axios from 'axios';

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [filteredRecipes, setFilteredRecipes] = useState([]); // State for filtered recipes

  useEffect(() => {
    axios.get('https://recipe-app-0i3m.onrender.com/recipes')  // Updated URL
      .then(response => {
        setRecipes(response.data);
        setFilteredRecipes(response.data); // Initialize with all recipes
      })
      .catch(error => console.error("Error fetching recipes:", error));
  }, []);

  useEffect(() => {
    // Filter recipes whenever the search term changes
    if (searchTerm) {
      const filtered = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes); // Show all recipes if search term is empty
    }
  }, [searchTerm, recipes]); // Re-run when searchTerm or recipes change

  return (
    <div>
      <HomepageNavbar />

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
      
      <div className="recipe-container">
        {filteredRecipes.map(recipe => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            isHomepage={true} // Pass this prop to hide favorites and reviews buttons
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
