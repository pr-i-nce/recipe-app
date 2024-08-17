import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';
import axios from 'axios';
import RecipesNavbar from '../components/Navbar/RecipesNavbar';
import Footer from '../components/Footer';

const WishlistPage = () => {
  const { authData } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get('/api/wishlist', {
          headers: {
            Authorization: `Bearer ${authData.token}`
          }
        });
        setWishlist(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWishlist();
  }, [authData.token]);

  return (
    <div>
      <RecipesNavbar />
      <div className="recipe-container">
        {wishlist.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
