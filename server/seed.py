from app import create_app, db
from app.models import Recipe

# Initialize the app and push the context
app = create_app()
with app.app_context():
    # Sample data for seeding the database
    names = [
        "Grilled Cheese", "Spaghetti Bolognese", "Vegetable Stir Fry", "BBQ Ribs",
        "Tacos", "Caesar Salad", "Margherita Pizza", "Mushroom Risotto",
        "Lemon Garlic Shrimp", "Chicken Tikka Masala", "Buffalo Wings", "Stuffed Peppers",
        "Beef Stroganoff", "Chicken Alfredo", "Fish Tacos"
    ]

    descriptions = [
        "A classic comfort food, crispy and gooey.",
        "A delicious and hearty dish perfect for family dinners.",
        "A quick and easy meal packed with veggies.",
        "Tender ribs with a tangy barbecue sauce.",
        "A versatile dish that's perfect for a quick meal.",
        "A fresh and crunchy salad with a creamy dressing.",
        "A classic Italian pizza with fresh tomatoes and basil.",
        "A creamy rice dish with mushrooms and Parmesan cheese.",
        "Juicy shrimp with a zesty lemon garlic sauce.",
        "A popular Indian dish with a rich tomato gravy.",
        "Spicy and tangy chicken wings.",
        "Stuffed bell peppers with a flavorful filling.",
        "Tender beef in a creamy mushroom sauce served over egg noodles.",
        "Rich and creamy pasta with chicken and Alfredo sauce.",
        "Crispy fish tacos with fresh salsa and creamy sauce."
    ]

    ingredients = [
        "Bread, cheese, butter, tomatoes, salt, pepper",
        "Spaghetti, beef mince, tomatoes, onions, garlic, olive oil, herbs",
        "Vegetables (bell peppers, carrots, broccoli), soy sauce, garlic, ginger, sesame oil",
        "Pork ribs, barbecue sauce, garlic, onions, salt, pepper",
        "Tortillas, ground beef, lettuce, cheese, salsa, sour cream",
        "Lettuce, croutons, Parmesan cheese, Caesar dressing",
        "Pizza dough, tomato sauce, mozzarella cheese, basil, olive oil",
        "Arborio rice, mushrooms, chicken stock, Parmesan cheese, onions, garlic",
        "Shrimp, garlic, lemon, butter, parsley, olive oil",
        "Chicken, yogurt, spices, tomatoes, onions, garlic",
        "Chicken wings, buffalo sauce, butter",
        "Bell peppers, ground beef, rice, tomatoes, cheese",
        "Beef, mushrooms, onions, sour cream, egg noodles",
        "Pasta, chicken breast, Alfredo sauce, Parmesan cheese",
        "Fish fillets, tortillas, cabbage, salsa, sour cream"
    ]

    instructions = [
        "Butter bread and layer with cheese. Grill until cheese is melted and bread is golden brown.",
        "Cook spaghetti according to package instructions. In a separate pan, cook beef mince with onions, garlic, and herbs. Add tomatoes and simmer. Combine with spaghetti and serve.",
        "Stir-fry vegetables with garlic and ginger. Add soy sauce and sesame oil. Serve over rice.",
        "Rub ribs with barbecue sauce and seasonings. Bake until tender. Finish with extra barbecue sauce.",
        "Cook ground beef with seasoning. Assemble in tortillas with lettuce, cheese, and salsa.",
        "Toss lettuce with croutons, Parmesan, and Caesar dressing.",
        "Spread tomato sauce on pizza dough. Top with mozzarella and basil. Bake until crust is golden.",
        "Sauté mushrooms with onions. Add Arborio rice and gradually add chicken stock while stirring. Finish with Parmesan cheese.",
        "Sauté shrimp with garlic and lemon. Serve with rice or vegetables.",
        "Marinate chicken in yogurt and spices. Cook with onions and tomatoes.",
        "Cook chicken wings with buffalo sauce and butter until crispy.",
        "Stuff bell peppers with a mixture of beef, rice, and cheese. Bake until tender.",
        "Cook beef with mushrooms and onions. Stir in sour cream and serve over egg noodles.",
        "Cook pasta and chicken separately. Mix with Alfredo sauce and serve with Parmesan cheese.",
        "Grill fish fillets and serve in tortillas with cabbage, salsa, and sour cream."
    ]

    main_photos = [
        "https://images.pexels.com/photos/8751408/pexels-photo-8751408.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",  # Grilled Cheese
        "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",  # Spaghetti Bolognese
        "https://images.pexels.com/photos/6126965/pexels-photo-6126965.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",  # Vegetable Stir Fry
        "https://images.pexels.com/photos/27599997/pexels-photo-27599997/free-photo-of-bbq-ribs.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",  # BBQ Ribs
        "https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",  # Tacos
        "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",  # Caesar Salad
        "https://images.pexels.com/photos/2232/vegetables-italian-pizza-restaurant.jpg",  # Margherita Pizza
        "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",  # Mushroom Risotto
        "https://images.pexels.com/photos/8633745/pexels-photo-8633745.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",  # Lemon Garlic Shrimp
        "https://images.pexels.com/photos/27521304/pexels-photo-27521304/free-photo-of-person-cutting-meat.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",  # Chicken Tikka Masala
        "https://images.pexels.com/photos/11299734/pexels-photo-11299734.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",  # Buffalo Wings
        "https://images.pexels.com/photos/18968712/pexels-photo-18968712/free-photo-of-spicy-dish-on-a-blue-plate.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",  # Stuffed Peppers
        "https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",  # Beef Stroganoff
        "https://images.pexels.com/photos/25884475/pexels-photo-25884475/free-photo-of-top-view-of-meal-and-spice.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",  # Chicken Alfredo
        "https://images.pexels.com/photos/27603312/pexels-photo-27603312/free-photo-of-authentic-mexican-food.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"   # Fish Tacos
    ]

    # Create and add recipes to the database
    for name, description, ingredient, instruction, photo in zip(names, descriptions, ingredients, instructions, main_photos):
        recipe = Recipe(
            name=name,
            description=description,
            ingredients=ingredient,
            instructions=instruction,
            main_photo=photo,
            user_id=1  # assuming admin user with ID 1 is adding these recipes
        )
        db.session.add(recipe)

    # Commit the changes to the database
    db.session.commit()

    print("Database seeded successfully!")
