import React, { useState, useEffect, useContext } from 'react';
import AdminRecipeCard from './AdminRecipeCard';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './AdminRecipeList.css';

const AdminRecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState(null);
    const { authData } = useContext(AuthContext);

    // Get token from localStorage or context
    const token = localStorage.getItem('access_token') || authData?.token;

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                console.log('Fetching admin recipes...');
                const response = await axios.get('https://recipe-app-0i3m.onrender.com/admin/recipes', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRecipes(response.data);
                console.log('Fetched recipes:', response.data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
                setError('Error fetching recipes.');
            }
        };

        if (token) {
            fetchRecipes();
        } else {
            setError('No token provided.');
        }
    }, [token]);

    const handleDelete = async (recipeId) => {
        try {
            console.log('Attempting to delete recipe with ID:', recipeId);
            const response = await axios.delete(`https://recipe-app-0i3m.onrender.com/admin/recipes/${recipeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
            } else {
                setError('Failed to delete recipe.');
            }
        } catch (error) {
            if (error.response) {
                setError(`Error deleting recipe: ${error.response.data.message || error.message}`);
            } else if (error.request) {
                setError('No response received from server.');
            } else {
                setError('Error deleting recipe.');
            }
        }
    };

    return (
        <div className="admin-recipe-list">
            {error && <p className="error-message">{error}</p>}
            {recipes.length === 0 ? (
                <p>No recipes found.</p>
            ) : (
                recipes.map(recipe => (
                    <AdminRecipeCard 
                        key={recipe.id}
                        recipe={recipe}
                        onDelete={handleDelete}
                    />
                ))
            )}
        </div>
    );
};

export default AdminRecipeList;
