import os

class Config:
    SECRET_KEY = 'your_secret_key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')  # Directory to save uploaded files
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # Maximum file size: 16MB
