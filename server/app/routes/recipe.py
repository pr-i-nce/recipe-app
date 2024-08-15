from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from app import db
from app.models import Recipe, Review, Favorite, Wishlist, Recommendation

recipe = Blueprint('recipe', __name__)

# Allowed extensions for uploaded files
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Get all recipes
@recipe.route('/recipes', methods=['GET'])
def get_recipes():
    recipes = Recipe.query.all()
    return jsonify([{
        'id': recipe.id,
        'name': recipe.name,
        'description': recipe.description,
        'ingredients': recipe.ingredients,
        'instructions': recipe.instructions,
        'main_photo': recipe.main_photo,
    } for recipe in recipes])

@recipe.route('/recipes/<int:recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({"message": "Recipe not found"}), 404
    return jsonify({
        'id': recipe.id,
        'name': recipe.name,
        'description': recipe.description,
        'ingredients': recipe.ingredients,
        'instructions': recipe.instructions,
        'main_photo': recipe.main_photo
    })

@recipe.route('/recipes', methods=['POST'])
@jwt_required()
def add_recipe():
    current_user_id = get_jwt_identity()
    
    # Check if the user provided a file or a URL for the main photo
    if 'main_photo' in request.files:
        main_photo = request.files['main_photo']

        if main_photo and allowed_file(main_photo.filename):
            filename = secure_filename(main_photo.filename)
            filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            main_photo.save(filepath)
            photo_path = filename
        else:
            return jsonify({"message": "Invalid file type for main photo"}), 400
    elif 'main_photo_url' in request.form:
        # If a URL is provided instead of a file
        main_photo_url = request.form['main_photo_url']
        photo_path = main_photo_url
    else:
        return jsonify({"message": "Main photo is required"}), 400

    # Create the new recipe
    new_recipe = Recipe(
        name=request.form['name'],
        description=request.form['description'],
        ingredients=request.form['ingredients'],
        instructions=request.form['instructions'],
        main_photo=photo_path,
        user_id=current_user_id
    )
    
    db.session.add(new_recipe)
    db.session.commit()
    return jsonify({"message": "Recipe added successfully"}), 201


@recipe.route('/recipes/<int:recipe_id>', methods=['PUT'])
@jwt_required()
def update_recipe(recipe_id):
    current_user_id = get_jwt_identity()
    recipe = Recipe.query.filter_by(id=recipe_id, user_id=current_user_id).first()

    if not recipe:
        return jsonify({"message": "Recipe not found or not authorized"}), 404

    # Check for file upload or URL update
    if 'main_photo' in request.files:
        main_photo = request.files['main_photo']
        if main_photo and allowed_file(main_photo.filename):
            filename = secure_filename(main_photo.filename)
            filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            main_photo.save(filepath)
            recipe.main_photo = filename
        else:
            return jsonify({"message": "Invalid file type for main photo"}), 400
    elif 'main_photo_url' in request.form:
        recipe.main_photo = request.form['main_photo_url']

    # Update other fields if provided
    recipe.name = request.form.get('name', recipe.name)
    recipe.description = request.form.get('description', recipe.description)
    recipe.ingredients = request.form.get('ingredients', recipe.ingredients)
    recipe.instructions = request.form.get('instructions', recipe.instructions)

    db.session.commit()
    return jsonify({"message": "Recipe updated successfully"}), 200

# Delete a recipe
@recipe.route('/recipes/<int:recipe_id>', methods=['DELETE'])
@jwt_required()
def delete_recipe(recipe_id):
    current_user_id = get_jwt_identity()
    recipe = Recipe.query.filter_by(id=recipe_id, user_id=current_user_id).first()

    if not recipe:
        return jsonify({"message": "Recipe not found or not authorized"}), 404

    db.session.delete(recipe)
    db.session.commit()
    return jsonify({"message": "Recipe deleted successfully"}), 200

# Add a review to a recipe
@recipe.route('/recipes/<int:recipe_id>/reviews', methods=['POST'])
@jwt_required()
def add_review(recipe_id):
    data = request.get_json()
    current_user_id = get_jwt_identity()
    new_review = Review(
        rating=data['rating'],
        comment=data.get('comment'),
        user_id=current_user_id,
        recipe_id=recipe_id
    )
    db.session.add(new_review)
    db.session.commit()
    return jsonify({"message": "Review added successfully"}), 201

# Get all reviews for a recipe
@recipe.route('/recipes/<int:recipe_id>/reviews', methods=['GET'])
def get_reviews(recipe_id):
    reviews = Review.query.filter_by(recipe_id=recipe_id).all()
    return jsonify([{
        'id': review.id,
        'rating': review.rating,
        'comment': review.comment,
        'created_at': review.created_at,
        'author': review.author.username
    } for review in reviews])

# Add a recipe to favorites
@recipe.route('/recipes/<int:recipe_id>/favorites', methods=['POST'])
@jwt_required()
def add_favorite(recipe_id):
    current_user_id = get_jwt_identity()
    if Favorite.query.filter_by(user_id=current_user_id, recipe_id=recipe_id).first():
        return jsonify({"message": "Recipe already in favorites"}), 400

    new_favorite = Favorite(user_id=current_user_id, recipe_id=recipe_id)
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify({"message": "Recipe added to favorites"}), 201

# Get all favorite recipes for the current user
@recipe.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    current_user_id = get_jwt_identity()
    favorites = Favorite.query.filter_by(user_id=current_user_id).all()
    return jsonify([{
        'id': favorite.recipe.id,
        'name': favorite.recipe.name,
        'description': favorite.recipe.description
    } for favorite in favorites])

# Add a recipe to wishlist
@recipe.route('/recipes/<int:recipe_id>/wishlist', methods=['POST'])
@jwt_required()
def add_to_wishlist(recipe_id):
    current_user_id = get_jwt_identity()
    if Wishlist.query.filter_by(user_id=current_user_id, recipe_id=recipe_id).first():
        return jsonify({"message": "Recipe already in wishlist"}), 400

    new_wishlist = Wishlist(user_id=current_user_id, recipe_id=recipe_id)
    db.session.add(new_wishlist)
    db.session.commit()
    return jsonify({"message": "Recipe added to wishlist"}), 201

# Get all wishlist items for the current user
@recipe.route('/wishlist', methods=['GET'])
@jwt_required()
def get_wishlist():
    current_user_id = get_jwt_identity()
    wishlist = Wishlist.query.filter_by(user_id=current_user_id).all()
    return jsonify([{
        'id': wish.recipe.id,
        'name': wish.recipe.name,
        'description': wish.recipe.description
    } for wish in wishlist])

# Recommend a recipe
@recipe.route('/recipes/<int:recipe_id>/recommend', methods=['POST'])
@jwt_required()
def recommend_recipe(recipe_id):
    data = request.get_json()
    current_user_id = get_jwt_identity()
    new_recommendation = Recommendation(
        user_id=current_user_id,
        recipe_id=recipe_id,
        reason=data['reason']
    )
    db.session.add(new_recommendation)
    db.session.commit()
    return jsonify({"message": "Recipe recommended successfully"}), 201

# Get all recommendations for the current user
@recipe.route('/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    current_user_id = get_jwt_identity()
    recommendations = Recommendation.query.filter_by(user_id=current_user_id).all()
    return jsonify([{
        'id': recommendation.recipe.id,
        'name': recommendation.recipe.name,
        'description': recommendation.recipe.description,
        'reason': recommendation.reason
    } for recommendation in recommendations])

# Search recipes
@recipe.route('/recipes/search', methods=['GET'])
def search_recipes():
    query = request.args.get('query', '').strip()
    filter_by = request.args.get('filter_by', 'name')

    if not query:
        return jsonify({"message": "No search query provided"}), 400

    if filter_by == 'name':
        results = Recipe.query.filter(Recipe.name.ilike(f"%{query}%")).all()
    elif filter_by == 'ingredients':
        results = Recipe.query.filter(Recipe.ingredients.ilike(f"%{query}%")).all()
    else:
        return jsonify({"message": "Invalid filter"}), 400

    return jsonify([{
        'id': recipe.id,
        'name': recipe.name,
        'description': recipe.description,
        'ingredients': recipe.ingredients,
        'instructions': recipe.instructions
    } for recipe in results])

