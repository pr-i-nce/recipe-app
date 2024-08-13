from app import db
from app.models import User
from werkzeug.security import generate_password_hash, check_password_hash
from app.auth.jwt_handler import create_access_token
from flask import current_app

def register_user(data):
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return {"message": "All fields are required.", "status": 400}

    existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
    if existing_user:
        return {"message": "Username or email already taken.", "status": 409}

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password_hash=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return {"message": "User registered successfully.", "status": 201}
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error registering user: {e}")
        return {"message": "Internal server error.", "status": 500}

def authenticate_user(data):
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return {"message": "All fields are required.", "status": 400}

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password_hash, password):
        token = create_access_token(identity=user.id)
        return {"message": "Login successful.", "token": token, "status": 200}

    return {"message": "Invalid username or password.", "status": 401}
