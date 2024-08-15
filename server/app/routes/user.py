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
        # Secure the filename and make it unique
        filename = secure_filename(photo.filename)
        timestamp = int(time.time())
        photo_filename = f"{user.username}_{timestamp}_{filename}"
        
        # Remove old photo if exists
        if user.profile_photo:
            old_photo_path = os.path.join(current_app.config['UPLOAD_FOLDER'], user.profile_photo)
            if os.path.exists(old_photo_path):
                os.remove(old_photo_path)
        
        # Save new photo
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
    user_id = get_jwt_identity()
    reviews = Review.query.filter_by(recipe_id=recipe_id).all()
    
    return jsonify([{
        'id': review.id,
        'author': User.query.get(review.user_id).username,  # Assuming you want to show the author's username
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


# Admin routes

# Get all support tickets
@user.route('/admin/support_tickets', methods=['GET'])
@jwt_required()
def get_support_tickets():
    user_id = get_jwt_identity()
    if user_id != 1: 
        return jsonify({"message": "Access forbidden"}), 403

    tickets = SupportTicket.query.all()
    return jsonify([{
        'id': ticket.id,
        'subject': ticket.subject,
        'message': ticket.message,
        'status': ticket.status,
        'user_id': ticket.user_id,
        'created_at': ticket.created_at
    } for ticket in tickets])

# Set status of a support ticket
@user.route('/admin/support_tickets/<int:ticket_id>', methods=['PATCH'])
@jwt_required()
def update_ticket_status(ticket_id):
    user_id = get_jwt_identity()
    if user_id != 1: 
        return jsonify({"message": "Access forbidden"}), 403

    data = request.get_json()
    ticket = SupportTicket.query.get(ticket_id)
    if not ticket:
        return jsonify({"message": "Ticket not found"}), 404

    # Default to 'pending' if no status provided
    status = data.get('status', 'pending')
    if status not in ['pending', 'completed']:
        return jsonify({"message": "Invalid status"}), 400

    ticket.status = status
    db.session.commit()
    return jsonify({"message": "Ticket status updated successfully"}), 200

# Get all users
@user.route('/admin/users', methods=['GET'])
@jwt_required()
def get_users():
    user_id = get_jwt_identity()
    if user_id != 1: 
        return jsonify({"message": "Access forbidden"}), 403

    users = User.query.all()
    return jsonify({
        'total_users': len(users),
        'users': [{
            'id': user.id,
            'username': user.username,
            'email': user.email
        } for user in users]
    })

# Get all recipes
@user.route('/admin/recipes', methods=['GET'])
@jwt_required()
def get_recipes():
    user_id = get_jwt_identity()
    if user_id != 1: 
        return jsonify({"message": "Access forbidden"}), 403

    recipes = Recipe.query.all()
    return jsonify([{
        'id': recipe.id,
        'name': recipe.name,
        'description': recipe.description
    } for recipe in recipes])

# Delete a recipe
@user.route('/admin/recipes/<int:recipe_id>', methods=['DELETE'])
@jwt_required()
def delete_recipe(recipe_id):
    user_id = get_jwt_identity()
    if user_id != 1: 
        return jsonify({"message": "Access forbidden"}), 403

    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({"message": "Recipe not found"}), 404

    db.session.delete(recipe)
    db.session.commit()
    return jsonify({"message": "Recipe deleted successfully"}), 200

