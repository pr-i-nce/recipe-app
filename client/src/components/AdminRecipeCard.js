import React from 'react';
import PropTypes from 'prop-types';

const AdminRecipeCard = ({ recipe, onDelete }) => {
    return (
        <div className="admin-recipe-card">
            <img src={recipe.main_photo} alt={recipe.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            
            <h3>{recipe.name}</h3>
            <p>{recipe.description}</p>

            <button onClick={() => onDelete(recipe.id)}>Delete Recipe</button>
        </div>
    );
};

AdminRecipeCard.propTypes = {
    recipe: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default AdminRecipeCard;
