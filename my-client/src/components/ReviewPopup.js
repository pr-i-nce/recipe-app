import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Adjust the path based on your folder structure

const ReviewPopup = ({ recipeId, reviews, onClose, onReviewAdded }) => {
    const { authData } = useContext(AuthContext); // Access authData from AuthContext
    const token = authData.token; // Extract the token from authData
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleAddReview = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!token) {
            setError("You must be logged in to add a review."); // Handle case when no token is found
            return; // Exit early if there is no token
        }

        try {
            await axios.post(`http://localhost:5000/recipes/${recipeId}/reviews`, {
                rating,
                comment,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Use the extracted token in the Authorization header
                },
            });
            setSuccess("Review added successfully!");
            setComment('');
            setRating(1);
            onReviewAdded(); // Refresh reviews in the parent component
        } catch (error) {
            console.error("Error adding review:", error.response.data);
            setError(
                error.response 
                    ? error.response.data.message 
                    : "Failed to add review. Please try again."
            );
        }
    };

    return (
        <div className="review-popup">
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleAddReview}>
                <div>
                    <label>Rating (1-5):</label>
                    <select value={rating} onChange={(e) => setRating(e.target.value)}>
                        {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Comment:</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit Review</button>
                <button type="button" onClick={onClose}>Close</button>
            </form>

            <h3>Existing Reviews</h3>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id} className="existing-review">
                        <p><strong>{review.author}: </strong>{review.comment} <span>({review.rating}/5)</span></p>      
                    </div>
                ))
            ) : (
                <p>No reviews yet.</p>
            )}
        </div>
    );
};

export default ReviewPopup;
