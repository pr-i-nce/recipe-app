from app import create_app, db
from app.models import Recipe  # Import your Recipe model

# Initialize the app and push the context
app = create_app()
with app.app_context():
    # Drop only the 'recipes' table
    Recipe.__table__.drop(db.engine)

    # Recreate the 'recipes' table
    db.create_all()  # This will create only the tables that don't already exist

    print("Recipe table dropped and recreated successfully!")

