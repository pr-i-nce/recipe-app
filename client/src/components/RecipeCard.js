import React, { useState, useEffect, useCallback, useContext } from 'react';
import './RecipeCard.css';
import RecipePopup from './RecipePopup';
import ReviewPopup from './ReviewPopup';
import { AuthContext } from '../context/AuthContext';

const RecipeCard = ({ recipe, onRecipeUpdated, isFavorite, onToggleFavorite, isHomepage }) => {
  const { authData } = useContext(AuthContext); 
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(false); 

  // Open and close recipe details popup
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);
  
  // Open and close review popup
  const openReviewPopup = () => setIsReviewPopupOpen(true);
  const closeReviewPopup = () => setIsReviewPopupOpen(false);

  // Fetch reviews for the specific recipe
  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`https://recipe-app-0i3m.onrender.com/recipes/${recipe.id}/reviews`);
      const data = await response.json();
      setReviews(data);
      
      // Calculate and set average rating
      const total = data.reduce((sum, review) => sum + review.rating, 0);
      const average = data.length > 0 ? total / data.length : 0;
      setAverageRating(average);

    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [recipe.id]);

  // Fetch reviews as soon as the component loads to show the average rating
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const renderStars = (averageRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= averageRating ? '#ffc107' : '#e4e5e9' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handleToggleFavorite = async () => {
    setLoading(true); 
    setError(null); 
    try {
      const method = isFavorite ? 'DELETE' : 'POST'; 
      const response = await fetch(`https://recipe-app-0i3m.onrender.com/recipes/${recipe.id}/favorites`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.token}`, 
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong!');
      }

      onToggleFavorite(recipe.id, !isFavorite); 
    } catch (error) {
      setError(error.message); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="recipe-card">
      <img src={recipe.main_photo} alt={recipe.name} className="recipe-image" />
      <h3>{recipe.name}</h3>
      <p><strong>Description:</strong> {recipe.description}</p>

      {/* Display average rating as stars */}
      <div className="average-rating">
        {renderStars(Math.round(averageRating))} 
        <span>({averageRating.toFixed(1)})</span> 
      </div>

      {/* Display error message if any */}
      {error && <div className="error-message">{error}</div>}

      <div className="recipe-card-buttons">
        <button onClick={openPopup}>View Details</button>

        {!isHomepage && (
          <>
            <span
              onClick={handleToggleFavorite}
              style={{
                cursor: 'pointer',
                fontSize: '24px',
                color: isFavorite ? 'red' : 'gray',
              }}
            >
              {loading ? '🔄' : isFavorite ? '❤️' : '🤍'}
            </span>
            <button onClick={openReviewPopup}>View Reviews ({reviews.length})</button>
          </>
        )}
      </div>

      {isPopupOpen && (
        <RecipePopup
          recipeId={recipe.id}
          onClose={closePopup}
          onRecipeUpdated={onRecipeUpdated}
        />
      )}

      {isReviewPopupOpen && (
        <ReviewPopup
          recipeId={recipe.id}
          reviews={reviews}
          onClose={closeReviewPopup}
          onReviewAdded={fetchReviews}
        />
      )}
    </div>
  );
};

export default RecipeCard;
