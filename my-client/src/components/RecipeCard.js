import React, { useState, useEffect, useCallback, useContext } from 'react';
import './RecipeCard.css';
import RecipePopup from './RecipePopup'; // Recipe details and possibly update functionality
import ReviewPopup from './ReviewPopup'; // Import the ReviewPopup component
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const RecipeCard = ({ recipe, onRecipeUpdated, isFavorite, onToggleFavorite }) => {
  const { authData } = useContext(AuthContext); // Get auth data from context
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null); // State for error handling
  const [loading, setLoading] = useState(false); // State for loading

  // Open and close recipe details popup
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);
  
  // Open and close review popup
  const openReviewPopup = () => setIsReviewPopupOpen(true);
  const closeReviewPopup = () => setIsReviewPopupOpen(false);

  // Fetch reviews for the specific recipe
  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/recipes/${recipe.id}/reviews`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [recipe.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]); // Fetch reviews for the recipe

  const handleToggleFavorite = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset error state
    try {
      const method = isFavorite ? 'DELETE' : 'POST'; // Determine method based on current state
      const response = await fetch(`http://localhost:5000/recipes/${recipe.id}/favorites`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.token}`, // Use token from context
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong!');
      }

      onToggleFavorite(recipe.id, !isFavorite); // Update favorite status in parent component
    } catch (error) {
      setError(error.message); // Set error message to display
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="recipe-card">
      <img src={recipe.main_photo} alt={recipe.name} className="recipe-image" />
      <h3>{recipe.name}</h3>
      <p><strong>Description:</strong> {recipe.description}</p>

      {/* Display error message if any */}
      {error && <div className="error-message">{error}</div>}

      <div className="recipe-card-buttons">
        <button onClick={openPopup}>View Details</button>
        <span
          onClick={handleToggleFavorite}
          style={{
            cursor: 'pointer',
            fontSize: '24px',
            color: isFavorite ? 'red' : 'gray', // Color red if isFavorite is true
          }}
        >
          {loading ? '🔄' : isFavorite ? '❤️' : '🤍'} {/* Show loading indicator */}
        </span>
        <button onClick={openReviewPopup}>View Reviews ({reviews.length})</button>
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
          onReviewAdded={fetchReviews} // Refetch reviews after adding if needed
        />
      )}

      <div className="recipe-reviews">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review">
              <p><strong>{review.author}: </strong>{review.comment} <span>({review.rating}/5)</span></p>
              
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
