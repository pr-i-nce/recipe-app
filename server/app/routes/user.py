from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Favorite, Recipe, Wishlist, Recommendation, SupportTicket, Review
import os
import time
from werkzeug.utils import secure_filename

user = Blueprint('user', __name__)

# Helper function to check if the user is an admin
def is_admin(user_id):
    return User.query.filter_by(id=user_id, is_admin=True).first() is not None

# Get user profile
@user.route('/user/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'profile_photo': user.profile_photo
    })

# Update user profile, including profile photo and password
@user.route('/user/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    data = request.form
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)

    # Handle profile photo
    photo = request.files.get('photo')
    if photo:
        filename = secure_filename(photo.filename)
        timestamp = int(time.time())
        photo_filename = f"{user.username}_{timestamp}_{filename}"
        
        if user.profile_photo:
            old_photo_path = os.path.join(current_app.config['UPLOAD_FOLDER'], user.profile_photo)
            if os.path.exists(old_photo_path):
                os.remove(old_photo_path)
        
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], photo_filename)
        photo.save(filepath)
        user.profile_photo = photo_filename

    # Handle password update
    if 'password' in data and data['password']:
        user.set_password(data['password'])

    db.session.commit()
    return jsonify({"message": "Profile updated successfully"}), 200

# Add a recipe to favorites
@user.route('/user/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    data = request.get_json()
    user_id = get_jwt_identity()
    recipe_id = data['recipe_id']

    favorite = Favorite(user_id=user_id, recipe_id=recipe_id)
    db.session.add(favorite)
    db.session.commit()
    return jsonify({"message": "Recipe added to favorites"}), 201

# Get all favorite recipes
@user.route('/user/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    favorite_recipes = [Recipe.query.get(fav.recipe_id) for fav in favorites]
    return jsonify([{
        'id': recipe.id,
        'name': recipe.name,
        'description': recipe.description
    } for recipe in favorite_recipes])

# Remove a recipe from favorites
@user.route('/user/favorites', methods=['DELETE'])
@jwt_required()
def delete_favorite():
    data = request.get_json()
    user_id = get_jwt_identity()
    recipe_id = data['recipe_id']

    favorite = Favorite.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()
    if not favorite:
        return jsonify({"message": "Favorite not found"}), 404

    db.session.delete(favorite)
    db.session.commit()
    return jsonify({"message": "Recipe removed from favorites"}), 200

# Add a recipe to wishlist
@user.route('/user/wishlist', methods=['POST'])
@jwt_required()
def add_to_wishlist():
    data = request.get_json()
    user_id = get_jwt_identity()
    recipe_id = data['recipe_id']

    wishlist_item = Wishlist(user_id=user_id, recipe_id=recipe_id)
    db.session.add(wishlist_item)
    db.session.commit()
    return jsonify({"message": "Recipe added to wishlist"}), 201

# Get all wishlist recipes
@user.route('/user/wishlist', methods=['GET'])
@jwt_required()
def get_wishlist():
    user_id = get_jwt_identity()
    wishlist_items = Wishlist.query.filter_by(user_id=user_id).all()
    wishlist_recipes = [Recipe.query.get(item.recipe_id) for item in wishlist_items]
    return jsonify([{
        'id': recipe.id,
        'name': recipe.name,
        'description': recipe.description
    } for recipe in wishlist_recipes])

# Remove a recipe from wishlist
@user.route('/user/wishlist', methods=['DELETE'])
@jwt_required()
def delete_from_wishlist():
    data = request.get_json()
    user_id = get_jwt_identity()
    recipe_id = data['recipe_id']

    wishlist_item = Wishlist.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()
    if not wishlist_item:
        return jsonify({"message": "Wishlist item not found"}), 404

    db.session.delete(wishlist_item)
    db.session.commit()
    return jsonify({"message": "Recipe removed from wishlist"}), 200

# Add a recipe to recommendations
@user.route('/user/recommendations', methods=['POST'])
@jwt_required()
def add_recommendation():
    data = request.get_json()
    user_id = get_jwt_identity()
    recipe_id = data['recipe_id']
    reason = data['reason']

    recommendation = Recommendation(user_id=user_id, recipe_id=recipe_id, reason=reason)
    db.session.add(recommendation)
    db.session.commit()
    return jsonify({"message": "Recipe added to recommendations"}), 201

# Get all recommended recipes
@user.route('/user/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    user_id = get_jwt_identity()
    recommendations = Recommendation.query.filter_by(user_id=user_id).all()
    recommended_recipes = [Recipe.query.get(rec.recipe_id) for rec in recommendations]
    return jsonify([{
        'id': recipe.id,
        'name': recipe.name,
        'description': recipe.description,
        'reason': rec.reason
    } for rec, recipe in zip(recommendations, recommended_recipes)])

# Helper function to check if the user is an admin
def is_admin(user_id):
    return User.query.filter_by(id=user_id, is_admin=True).first() is not None

# Add a review for a recipe
@user.route('/recipes/<int:recipe_id>/reviews', methods=['POST'])
@jwt_required()
def add_review(recipe_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    rating = data.get('rating')
    comment = data.get('comment')

    if not rating or not comment:
        return jsonify({"message": "Rating and comment are required"}), 400

    review = Review(user_id=user_id, recipe_id=recipe_id, rating=rating, comment=comment)
    db.session.add(review)
    db.session.commit()
    return jsonify({"message": "Review added successfully"}), 201

# Get all reviews for a specific recipe
@user.route('/recipes/<int:recipe_id>/reviews', methods=['GET'])
@jwt_required()
def get_reviews(recipe_id):
    reviews = Review.query.filter_by(recipe_id=recipe_id).all()
    
    return jsonify([{
        'id': review.id,
        'author': User.query.get(review.user_id).username,
        'rating': review.rating,
        'comment': review.comment
    } for review in reviews])

# Delete a review
@user.route('/recipes/<int:recipe_id>/reviews/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(recipe_id, review_id):
    user_id = get_jwt_identity()
    review = Review.query.filter_by(id=review_id, recipe_id=recipe_id, user_id=user_id).first()

    if not review:
        return jsonify({"message": "Review not found"}), 404

    db.session.delete(review)
    db.session.commit()
    return jsonify({"message": "Review deleted successfully"}), 200

# Admin-only route to delete any review
@user.route('/admin/recipes/<int:recipe_id>/reviews/<int:review_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_review(recipe_id, review_id):
    user_id = get_jwt_identity()
    if not is_admin(user_id):
        return jsonify({"message": "Access forbidden"}), 403

    review = Review.query.filter_by(id=review_id, recipe_id=recipe_id).first()

    if not review:
        return jsonify({"message": "Review not found"}), 404

    db.session.delete(review)
    db.session.commit()
    return jsonify({"message": "Review deleted successfully"}), 200


# Upload a new recipe (for normal users)
@user.route('/user/recipes', methods=['POST'])
@jwt_required()
def upload_recipe():
    user_id = get_jwt_identity()
    data = request.form
    name = data.get('name')
    description = data.get('description')
    photo_url = data.get('main_photo_url')  # Expecting URL for main_photo

    if not photo_url:
        return jsonify({"message": "Main photo URL is required."}), 400

    # Save the recipe to the database
    new_recipe = Recipe(
        name=name,
        description=description,
        user_id=user_id,
        main_photo=photo_url  # Store the URL directly
    )
    db.session.add(new_recipe)
    db.session.commit()

    return jsonify({"message": "Recipe uploaded successfully", "recipe_id": new_recipe.id}), 201

