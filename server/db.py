from app import create_app, db

# Initialize the app and push the context
app = create_app()
with app.app_context():
    # Drop all tables
    db.drop_all()
    db.create_all()
    print("All tables successfully!")
